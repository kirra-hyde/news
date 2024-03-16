describe('Story', function() {
  it('should create a Story instance with the correct properties', function() {
    let storyData = {
      storyId: 1,
      title: 'Test Story',
      author: 'Test Author',
      url: 'https://www.example.com',
      username: 'testuser',
      createdAt: new Date()
    };
    let story = new Story(storyData);

    expect(story.storyId).toEqual(1);
    expect(story.title).toEqual('Test Story');
    // etc
  });

  it('should correctly parse the hostname from the URL', function() {
    let story = new Story({ url: 'https://www.testdomain.com/path' });
    expect(story.getHostName()).toEqual('www.testdomain.com');
  });

  //Testing the static method requires mocking axios
  it('should fetch a story from the API', async function() {
    // Mock axios.get to return a predefined story object
    const mockStory = {
        storyId: 1,
        title: 'Fetched Story',
        author: 'Test Author',
        url: 'https://www.example.com',
        username: 'testuser',
        createdAt: new Date()
      };
    axios.get = jasmine.createSpy('axios.get').and.returnValue(Promise.resolve({ data: { story: mockStory } }));
    let story = await Story.getStory(1)
    expect(story.title).toEqual('Fetched Story');
  });
});