import React, { useState } from "react";
import axios from "axios";
import md5 from "js-md5";
import 'reset-css';
import "../../styles/global.css";
import styles from "./App.module.css";
import Spinner from "../Spinner/Spinner";
import Message from "../Message/Message";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SearchArea from "../SearchArea/SearchArea";
import Results from "../Results/Results";
import CreatorPreview from "../CreatorPreview/CreatorPreview";
import ComicPreview from "../ComicPreview/ComicPreview";

function App() {
  // TODO: Make ARIA enabled
  const BASE_API_ENDPOINT = "https://gateway.marvel.com/v1/public";

  const [attribution, setAttribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const defaultErrorMessage = "Erf! Something went wrong. Please try again.";
  const defaultPagination = {
    count: 0,
    limit: 0,
    offset: 0,
    total: 0
  };

  // Search state
  const [showSearch, setShowSearch] = useState(true);
  const [showSearchNav, setShowSearchNav] = useState(false);

  // Creator state
  const [showCreatorResults, setShowCreatorResults] = useState(false);
  const [creators, setCreators] = useState([]);
  const [creatorSearchPagination, setCreatorSearchPagination] = useState(defaultPagination);
  const [creatorSearchName, setCreatorSearchName] = useState({
      firstName: "",
      lastName: ""
  });
  const [selectedCreatorNameIndicator, setSelectedCreatorNameIndicator] = useState("");
  const [creatorSearchNameIndicator, setCreatorSearchNameIndicator] = useState("");
  const [creatorSearchIsLoading, setCreatorSearchIsLoading] = useState(false);
  const [creatorIsLoading, setCreatorIsLoading] = useState(false);

  // Comic state
  const [creatorId, setCreatorId] = useState(null); // Selected creator Id
  const [showComicResults, setShowComicResults] = useState(false);
  const [comics, setComics] = useState([]);
  const [comicSearchPagination, setComicSearchPagination] = useState(defaultPagination);
  const [comicSearchIsLoading, setComicSearchIsLoading] = useState(false);
  const [comicIsLoading, setComicIsLoading] = useState(false);

  // Creator Preview state
  const [showCreatorPreview, setShowCreatorPreview] = useState(false);
  const [comicCreatorPreviewData, setComicCreatorPreviewData] = useState(null);
  
  // Comic Preview state
  const [showComicPreview, setShowComicPreview] = useState(false);
  const [comicPreviewData, setComicPreviewData] = useState(null);
  
  function getHash() {
      return md5(Date.now() + import.meta.env.VITE_MARVEL_API_PRIVATE_KEY + import.meta.env.VITE_MARVEL_API_PUBLIC_KEY);
  }

  function scrollToResults() {
    const containerEl = document.getElementById("results-container");
    if (containerEl) {
      containerEl.scrollIntoView({
        behavior: "smooth"
      });
    }
  }

  function setCredit(attribution) {
    setAttribution(attribution);
    window.localStorage.setItem('attribution',attribution);
  }

  function handleCreatorSearch(searchName, offsetVal = 0) {
    // console.log('run handleCreatorSearch: Name => ' + searchName.firstName + ' ' + searchName.lastName);
    if (searchName.firstName !== "" || searchName.lastName !== "") {
      setCreatorSearchName(searchName);
      setCreatorSearchIsLoading(true);
      axios.get(BASE_API_ENDPOINT + '/creators', {
        params: {
          ts: Date.now(),
          apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY,
          hash: getHash(),
          firstNameStartsWith: searchName.firstName || null,
          lastNameStartsWith: searchName.lastName || null,
          offset: offsetVal,
          limit: 20
        }
      })
      .then(function (response) {
        // console.log(response);
        const { count, limit, offset, total } = response.data.data;
        setShowSearchNav(true);
        setCredit(response.data.attributionHTML);
        setCreatorSearchPagination({
          count: count,
          limit: limit,
          offset: offset,
          total: total
        });
        setCreators((count > 0) ? response.data.data.results : []);
        const indicator = searchName.firstName + ' ' + searchName.lastName;
        setCreatorSearchNameIndicator(indicator.trim());

        // Deep link
        scrollToResults();
      })
      .catch(function (error) {
          console.log(error);
          setCreators([]);
          setCreatorSearchNameIndicator("");
          setErrorMessage(defaultErrorMessage);
      })
      .finally(function () {
          setCreatorSearchIsLoading(false);
          setShowSearch(false);
          setShowCreatorResults(true);
      });
    } else {
      // console.log("run handleCreatorSearch with empty search");
      setErrorMessage("Oops! You need to enter a name to search.");
    }
  }

  /**
   * Handles pagination changes for creator and comic searches.
   * @param {string} context - The context of the search, either "creator" or "comic".
   * @param {string} name - The direction of pagination, either "next" or "prev".
   */
  function handlePaginationChange(context, name) {
    let newOffset = 0;
    if (name === "next") {
      if (context === "creator") {
        newOffset = creatorSearchPagination.offset + creatorSearchPagination.limit;
      } else if (context === "comic") {
        newOffset = comicSearchPagination.offset + comicSearchPagination.limit;
      }
    } else if (name === 'prev') {
      if (context === "creator") {
        newOffset = creatorSearchPagination.offset - creatorSearchPagination.limit;
      } else if (context === "comic") {
        newOffset = comicSearchPagination.offset - comicSearchPagination.limit;
      }
    }
    if (context === "creator") {
      handleCreatorSearch(creatorSearchName, newOffset);
    } else if (context === "comic") {
      handleComicSearch(creatorId, selectedCreatorNameIndicator, newOffset);
    }
  }

  function handleCreatorSelect(id) {
    resetResultsAndPreview();
    setShowSearch(false);
    handleCreatorPreview(id);
  }

  function handleCreatorPreview(id) {
    // console.log('run handleCreatorPreview, id: ' + id);
    setCreatorIsLoading(true);
    axios.get(BASE_API_ENDPOINT + "/creators/" + id, {
      params: {
        ts: Date.now(),
        apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY,
        hash: getHash()
      }
    })
    .then(function (response) {
      // console.log(response);
      setComicCreatorPreviewData(response.data.data.results[0]);
      setCredit(response.data.attributionHTML);
      setShowCreatorPreview(true);
      setShowComicPreview(false);
    })
    .catch(function (error) {
        console.error(error);
        setErrorMessage(defaultErrorMessage);
    })
    .finally(function() {
      setCreatorIsLoading(false);
    });
  }

  // Function to call when creator card is clicked and when pagination is run
  function handleComicSearch(id, name, offsetVal = 0) {
    // console.log("run handleComicSearch, creatorId: " + id);    
    setCreatorId(id); //? This is used for pagination, is there a better way
    setSelectedCreatorNameIndicator(name);
    setComicSearchIsLoading(true);
    axios.get(BASE_API_ENDPOINT + "/creators/" + id + "/comics", {
      params: {
        ts: Date.now(),
        apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY,
        hash: getHash(),
        format: "comic",
        offset: offsetVal,
        limit: 20,
        orderBy: "onsaleDate"
      }
    })
    .then(function (response) {
      // console.log(response);
      const { count, limit, offset, total, results } = response.data.data;
      setCredit(response.data.attributionHTML);
      setComicSearchPagination({
        count: count,
        limit: limit,
        offset: offset,
        total: total
      });
      if (count > 0) {
        // console.log(results);
        setComics(results);
      } else {
        setComics([]);
      }
      // Deep link
      scrollToResults();
    })
    .catch(function (error) {
        console.log(error);
        setComics([]);
        // setComicSearchNameIndicator("");
        setErrorMessage(defaultErrorMessage);
    })
    .finally(function () {
        setComicSearchIsLoading(false);
        setShowCreatorResults(false);
        setShowComicResults(true);
    });
  }

  function handleComicSelect(comicId) {
    // console.log('run handleComicSelect, comic id => ' + comicId);
    setComicIsLoading(true);
    axios.get(BASE_API_ENDPOINT + "/comics/" + comicId, {
      params: {
        ts: Date.now(),
        apikey: import.meta.env.VITE_MARVEL_API_PUBLIC_KEY,
        hash: getHash()
      }
    })
    .then(function (response) {
      // console.log(response);
      setComicPreviewData(response.data.data.results[0]);
      setShowComicResults(false);
      setShowCreatorPreview(false);
      setShowComicPreview(true);
    })
    .catch(function (error) {
      console.error(error);
      setErrorMessage(defaultErrorMessage);
    })
    .finally(function () {
      setComicIsLoading(false);
    });
  }

  function resetResultsAndPreview() {

    // Clear error if any
    setErrorMessage("");

    // Show Search
    setShowSearchNav(true);

    // Creator Results states
    setShowCreatorResults(false);
    setCreators([]);
    setCreatorSearchNameIndicator("");
    setSelectedCreatorNameIndicator("");
    
    // Comic Results states
    setShowComicResults(false);
    setComics([]);
    
    // Creator Preview states
    setShowCreatorPreview(false);
    setComicCreatorPreviewData(null);
    
    // Comic Preview states
    setShowComicPreview(false);
    setComicPreviewData(null);
  }

  function handleNewSearch() {
    resetResultsAndPreview();
    setShowSearchNav(false);
    setShowSearch(true);
  }

  function handleStorageChange(storageName, itemObj, storeItem) {
    const storage = localStorage.getItem(storageName);
    let storedItemsArr = JSON.parse(storage) || [];
    const findIndexCallback = (item) => item.id === itemObj.id;
    const itemIndex = storedItemsArr.findIndex(findIndexCallback);
    const containsItem = (itemIndex !== -1) ? true : false;
    // If action is to store and storage array does not contain item with matching id
    if (storeItem && !containsItem) {
      storedItemsArr.push(itemObj);
    // Else if, action is to remove and array contains item with matching id
    } else if (!storeItem && containsItem) {
      storedItemsArr.splice(itemIndex, 1);
    }
    // If stored items array contains items, add to localStorage
    if (storedItemsArr.length) {
      localStorage.setItem(storageName, JSON.stringify(storedItemsArr));
    // Else, remove item from localStorage
    } else {
      localStorage.removeItem(storageName);
    }
  }

  function handleErrorMessageClose() {
    setErrorMessage("");
  }

  function handleStoredResults(context) {
    const storage = localStorage.getItem(context);
    const storedResultsArr = JSON.parse(storage);
    resetResultsAndPreview();
    if (storage === null) {
      setErrorMessage(`Pow! You do not have any stored ${context} at this time. You can store one after selecting one.`)
    } else {
      // Set pagination
      const paginationLimit = 20;
      const storedItemsLength = storedResultsArr.length;
      const paginationObj = {
        count: () => {
            return (storedItemsLength > paginationLimit) ? 20 : storedItemsLength;
        },
        limit: paginationLimit,
        offset: 0,
        total: storedItemsLength
      };
      setShowSearch(false);
      if (context === "creators") {
        setShowCreatorResults(true);
        setCreatorSearchPagination(paginationObj);
        setCreators(storedResultsArr);
        setCreatorSearchNameIndicator("Stored Creators");
      } else if (context === "comics") {
        setShowComicResults(true);
        setComicSearchPagination(paginationObj);
        setComics(storedResultsArr);
        setSelectedCreatorNameIndicator("Stored Comics");
      }
    }
  }

  function smoothScroll(selector) {
    window.setTimeout(function() {
      const card = document.getElementById(selector);
      if (card !== null) {
        card.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        scrollToResults();
      }
    }, 400); //? Is there a better way to call these functions when results state changes
  }

  function handleResultAnchor(context, id) {
    // TODO: Revise or remove this functionality for creator context

    if (context === "comic") {
      setShowComicResults(true);
      setShowComicPreview(false);
    } else if (context === "creator") {
      setShowCreatorResults(true);
      setShowCreatorPreview(false);
    }
    
    // Auto scroll into view functionality
    smoothScroll("card-" + id);
  }

  function handleRelatedCreator(id, name = "") {
    handleCreatorSelect(id, name);
  }

  function handleCreatorComicsBrowse(id, name) {
    setShowCreatorPreview(false);
    handleComicSearch(id, name);
  }

  return (
    <div className={styles.app} id="app">
      <Header
        searchNav={showSearchNav}
        onNewSearch={handleNewSearch}
        onStoredDisplay={handleStoredResults}
        headingText="Browse Comics"
      />
      <main className={styles.appMain}>
        {(errorMessage !== "") && <Message error={errorMessage} onErrorMessageClose={handleErrorMessageClose} />}
        {showSearch && <SearchArea onSearch={handleCreatorSearch} onFeaturedCreatorSelect={handleCreatorSelect} />}
        {(creatorSearchIsLoading || comicSearchIsLoading || creatorIsLoading || comicIsLoading) && <Spinner />}        
        {showCreatorResults && <Results
          context="creator"
          pagination={creatorSearchPagination}
          results={creators}
          indicator={creatorSearchNameIndicator}
          onPaginationChange={handlePaginationChange}
          onCardSelect={handleCreatorSelect}
        />}
        {showComicResults && <Results 
          context="comic"
          pagination={comicSearchPagination}
          results={comics}
          indicator={selectedCreatorNameIndicator}
          onPaginationChange={handlePaginationChange}
          onCardSelect={handleComicSelect}
        />}
        {showCreatorPreview && 
          <CreatorPreview
            creator={comicCreatorPreviewData}
            onCreatorStorage={handleStorageChange}
            onCreatorComicsBrowse={handleCreatorComicsBrowse}
          />
        }
        {showComicPreview && 
          <ComicPreview
            comic={comicPreviewData}
            onComicStorage={handleStorageChange}
            onRelatedCreator={handleRelatedCreator}
            onHandleBack={handleResultAnchor}
          />
        }
      </main>
      <Footer credit={attribution} />
    </div>
  )
}

export default App;
