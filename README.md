## Principles

1. We should have a strong guarantee that our unit tests do not hit external services
2. We should have a mechanism to asset libraries which are tightly coupled to external services (APIs, databases) actually work against those services, without having to solely rely on integration tests with those services.
3. Mocked behavior of HTTP connections should be as close to real behavior as possible
4. Mocks should require minimal manual work

## Examples

HTTP assertions

```javascript
describe('facebook', () => {
  before(() => {
    yesno = new YesNo();
    yesno.enable();
  });

  describe('#getProfile', async () => {
    yesno.start();
    // Depending on configuration of Yesno, this request will either
    // A. Hit the live service
    // or B. Play back from the mocks
    // Yesno will intercept the request regardless, so that we
    // can write the assertions below.
    const profile = await facebook.getProfile();

    // Assert HTTP behavior correct
    expect(yesno).http.to.have.requestCount(1);
    expect(yesno).http.request(1).to.have.method.post;
    expect(yesno).http.request(1).url.to.match(/profile/);
    expect(yesno).http.request(1).to.have.status(200);

    // Assert data correlates to HTTP request/response
    expect(profile).to.have.property(
      'id', 
      yes.response(1).body.id
    )

    yesno.save();
  });
});
```

Future work: Extensions for any TCP based protocol (not sure if feasible)
```javascript
describe('User', () => {
  before(() => {
    yesno = new Yesno({ extensions: [yesno.postgres] });
    yesno.enable();
  });

  describe('#find', async () => {
    const user = await User.find({ id: 1 });

    expect(yesno).postgres.to.have.queryCount(1);
    expect(yesno).postgres.query(1).to.match(/SELECT * FROM USERS/);

    // Assert data correlates to HTTP request/response
    expect(user).to.have.property(
      'id', 
      yes.response(1).rows[0].id
    )
  });
});
```