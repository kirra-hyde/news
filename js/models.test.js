"use strict";

const mock = new AxiosMockAdapter(axios);

const storyData1 = {
  storyId: "123",
  title: "Test Story",
  author: "Test Author",
  url: "https://www.example.com/path",
  username: "testuser",
  createdAt: "2024-03-16T00:00:12.142Z"
};

const storyData2 = {
  storyId: "124",
  title: "Test Story 2",
  author: "Test Author 2",
  url: "https://www.quexample.com/path",
  username: "testuser2",
  createdAt: "2024-02-16T00:00:12.142Z"
};

const storyData3 = {
  storyId: "125",
  title: "Test Story 3",
  author: "Test Author 3",
  url: "https://www.example.com",
  username: "testuser",
  createdAt: "2024-03-11T00:00:12.142Z"
};

const userData = {
  username: "testuser",
  name: "Test User",
  createdAt: "2022-07-16T00:00:12.142Z"
};

const userDataFavs = {
  username: "testuser2",
  name: "Test User 2",
  createdAt: "2022-08-16T00:00:12.142Z",
  favorites: [storyData1, storyData2]
};

describe("Story", function () {

  it("getHostName", function () {
    const story = new Story(storyData1);
    expect(story.getHostName()).toEqual("www.example.com");
  });

  // getStory uses axios, so testing it requires mocking axios
  it("getStory", async function () {
    // Mock axios.get to return predefined story data
    mock.onGet(`${BASE_URL}/stories/123`).reply(200, {
      story: storyData1,
    });

    const story = await Story.getStory("123");
    expect(story).toBeInstanceOf(Story);
    expect(story.title).toEqual("Test Story");
  });
});

describe("StoryList", function () {
  it("getStories", async function () {
    // Mock axios.get to return predefined data of stories
    mock.onGet(`${BASE_URL}/stories`).reply(200, {
      stories: [storyData1, storyData2]
    });

    const stories = await StoryList.getStories();
    expect(stories).toBeInstanceOf(StoryList);
    expect(stories.stories.length).toEqual(2);
    expect(stories.stories[0]).toBeInstanceOf(Story);
  });

  it("addStory", async function () {
    // Create User to add a story
    const testUser = new User(userData, "246");

    // Mock axios.post
    mock.onPost(`${BASE_URL}/stories`).reply(201, { story: storyData3 });

    const story1 = new Story(storyData1);
    const story2 = new Story(storyData2);
    const stories = new StoryList([story1, story2]);

    expect(stories.stories.length).toEqual(2);

    const newStory = await stories.addStory(testUser, {
      author: "Test Author 3",
      title: "Test Story 3",
      url: "https://www.example.com"
    });

    expect(newStory).toBeInstanceOf(Story);
    expect(stories.stories.length).toEqual(3);
    expect(stories.stories[0].storyId).toEqual(newStory.storyId);
    expect(stories.stories[0].username).toEqual(testUser.username);
  });
});

describe("User", function () {
  it("signup", async function () {
    mock.onPost(`${BASE_URL}/signup`).reply(201, { token: "135", user: userData });
    const newUser = await User.signup("testuser", "password", "Test User");

    expect(newUser).toBeInstanceOf(User);
    expect(newUser.username).toEqual("testuser");
    expect(newUser.loginToken).toEqual("135");
  });

  it("login", async function () {
    mock.onPost(`${BASE_URL}/login`).reply(200, { token: "135", user: userData });
    const user = await User.login("testuser", "password");

    expect(user).toBeInstanceOf(User);
    expect(user.username).toEqual("testuser");
    expect(user.loginToken).toEqual("135");
  });

  it("loginViaStoredCredentials", async function () {
    mock.onGet(`${BASE_URL}/users/testuser`).reply(200, { user: userData });
    const user = await User.loginViaStoredCredentials("246", "testuser");

    expect(user).toBeInstanceOf(User);
    expect(user.username).toEqual("testuser");
    expect(user.loginToken).toEqual("246");
  });

  it("addFavorite", async function () {
    mock.onPost(`${BASE_URL}/users/testuser/favorites/123`).reply(200);
    mock.onPost(`${BASE_URL}/users/testuser/favorites/124`).reply(200);
    const user = new User(userData, "135");
    const story1 = new Story(storyData1);
    const story2 = new Story(storyData2);

    expect(user.favorites).toEqual([]);

    await user.addFavorite(story1);
    await user.addFavorite(story2);

    expect(user.favorites).toEqual([story1, story2]);
  });

  it("removeFavorite", async function () {
    mock.onDelete(`${BASE_URL}/users/testuser2/favorites/123`).reply(200);
    mock.onDelete(`${BASE_URL}/users/testuser2/favorites/124`).reply(200);
    const user = new User(userDataFavs, "246");
    const story1 = new Story(storyData1);
    const story2 = new Story(storyData2);

    expect(user.favorites).toEqual([story1, story2]);

    await user.removeFavorite(story1);
    expect(user.favorites).toEqual([story2]);

    await user.removeFavorite(story1);
    expect(user.favorites).toEqual([story2]);

    await user.removeFavorite(story2);
    expect(user.favorites).toEqual([]);
  });

  it("checkFavorite", function () {
    const user = new User(userDataFavs, "246");
    expect(user.checkFavorite("123")).toBeTrue();
    expect(user.checkFavorite("124")).toBeTrue();
    expect(user.checkFavorite("125")).toBeFalse();
  });
});