"use strict";

const mock = new AxiosMockAdapter(axios);

const storyData = {
  storyId: "123",
  title: "Test Story",
  author: "Test Author",
  url: "https://www.example.com/path",
  username: "testuser",
  createdAt: "2024-03-16T00:00:12.142Z"
}

describe("Story", function () {

  it("getHostName", function () {
    const story = new Story(storyData);
    expect(story.getHostName()).toEqual("www.example.com");
  });

  // getStory uses axios, so testing it requires mocking axios
  it("getStory", async function () {
    // Mock axios.get to return predefined story data
    mock.onGet(`${BASE_URL}/stories/123`).reply(200, {
      story: storyData,
    });

    const story = await Story.getStory("123");
    expect(story).toBeInstanceOf(Story);
    expect(story.title).toEqual("Test Story");
  });
});