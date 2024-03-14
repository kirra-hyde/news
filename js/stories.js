"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 * If current User, markup has clickable icon for favoriting/unfavoriting Stories.
 */

function generateStoryMarkup(story) {

  const hostName = story.getHostName();
  let filled = "";
  if (currentUser) {
    filled = currentUser.checkFavorite(story.storyId) ?
      "bi bi-star-fill" :
      "bi bi-star";
  }
  return $(`
      <li id="${story.storyId}">
        <i class="${filled} star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Have HTML generated for all Stories in storyList, and put on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our Stories and have their HTML generated
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Have HTML generated for Stories in currentUser's favorites, and put on page. */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  //loop through current User's favorited Stories and have their HTML generated
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle story submission.
 *
 * Get form data.  Have a Story instance made and added to StoryList w/ that data.
 * Have the Stories from the updated StoryList put on the page.
 * Navigate to stories page.
 */

async function submitStory(evt) {
  console.debug("submitStory")
  evt.preventDefault();

  const author = $("#submit-author").val() || "Unknown";
  const title = $("#submit-title").val();
  const url = $("#submit-url").val();

  const storyData = { author, title, url };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitStoryForm.trigger("reset");
  hidePageComponents();
  putStoriesOnPage();
}

$submitStoryForm.on("submit", submitStory);
