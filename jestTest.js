const makeAPIRequests = require('./testlocateapi')

test('makeAPIRequests should return an array with a length of 10', async () => {
    const result = await makeAPIRequests(42.358528, -83.271400, 5, 10);
    expect(result).toHaveLength(10);
}, 10000);
