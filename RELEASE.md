# Release

In this file, you indicate the status of your assignment by checking the checkboxes below. No unchecked checkboxes are allowed in the document when your hand in for an assessment.

## Release status

_To make a release that will be assessed by the examiner, you need to make sure all checkboxes below are checked. You check a checkbox by adding an "x" within the brackets._

- [x] I have started working on the assignment.
- [x] All functional requirements are met.
- [x] All non-functional requirements are met.
- [x] I have completed the assignment report (see below).
- [x] README.md contains instructions on how to test the API

---

- [x] I intend to submit the assignment, and at the same time, I guarantee that I am the one who created the code that is submitted. In cases where I use external libraries or borrowed code from other sources, the source is clearly stated.
      (_Jag avser göra en inlämning av uppgiften och jag garanterar samtidigt att jag är den som skapat koden som lämnas in. I de fall jag använder externa bibliotek eller har lånat kod från andra källor så är källan tydligt angiven._)

---

## Assignment report

### HATEOAS

_Explain and defend your implementation of HATEOAS in your solution._

All JSON response bodies from the API have a \_links field. Lists have a \_links field in each item. The field contains key/value pairs with a description and url for self and related resources. By making a GET request to the root of the API Links are provided to each endpoint. The format is perhaps not very "wordy" with href and name properties etc, but I think it's simple, self-explanatory and sufficient for this relatively small API, and makes it easy to "browse" the api.

### Multiple representations

_If your solution were to implement multiple representations of the resources. How would you do it?_

I would include content negotiation and check the value of the Accept header in the request. The response would then try to match the accept. This could include format (e.g. xml instead of json), or version of the API (e.g. v1.0). However, for "selecting" fields I would rather use query parameters, e.g. _"/ads?select=title,description&expand=area"_ which would only return the fields specified in the select param and expand the area field to include name and population instead of just showing the id.

### Autentication

_Motivate and defend your authentication solution. What other authentication solutions could you implement? What pros/cons do this solution have?_

1. A publisher can be registered with a POST request to _/publishers_ containing email and password fields in the body.
2. These credentials can then be used in a POST request to /auth, which returns a JWT in the response body along with relevant information about the token. The response also contains no-cache headers. The JWT has an expiration of 10 minutes and the custom claim "id" which is the publisher's id.
3. Any resources that require authentication will check for a Authorization header with a Bearer value followed by the token. If the header or token is missing or the token cannot be verified by the server (i.e. secret does not match), then a 401 response is sent to the client along with a _WWW-Authenticate_ header with _Bearer_ value and a body with an error message and a link to /auth with a description on how to obtain a token.
4. If a token is verified, then a roundtrip is made to the database to search for a publisher with the id specified in the token. If the publisher is found and also (where relevant) matches the requested resource's publisher field, then the client is authenticated and authorized to create/update/delete the resource. In case the token is verified but the client is not authorized to modify a resouce (e.g. by sending a PATCH to /ads/xyz which is owned by another publisher), then a 403 response is sent.

Main pro with JWT is that it is truly stateless and carries all the information needed in the token itself. The main con is that the stateless nature of the JWT makes it hard to invalidate a JWT once it has been created by the server. So there is a balance between having a short expiration and the inconvenience of having to get a new token every x minutes. There are various solutions for this but they are quite cumbersome to implement..

**Other auth methods could have been:**

1. Basic authentication (Pro: easy, Con: not very secure - username/password can easily be decoded)
2. API keys (Pros: easy, can be invalidated, can be used for tracking client activity, do not expose username/password. Cons: Can be sniffed if sent through unencrypted http traffic, can be accidentally saved in insecure places and then used by anyone.)
3. OpenId Connect (Pros: very secure, can get tokens with information embedded, the API would not need to handle username/passwords, Cons: Maybe the users don't want to share their email or username stored in the authorization server?)

### Webhooks

_Explain how your webhook works_

A publisher with a valid token can send a POST to /hooks with a body containing action and callback. The action can be one of "newAd" or "newPublisher" and the callback a URL. Whenever a new ad or new publisher is created, the server searches the database for any hooks containing the relevant action and sends a POST to the callback URL with a body containing information about the created resource. A publisher can browse their own hooks with a GET request to /hooks or /hooks/:id and edit/delete hooks with PATCH/DELETE requests to /hooks/:id. All requests to /hooks require authentication.

I tested that the hooks work at https://webhook.site/#!/c0fad125-740e-415d-9e29-b158d7b98ca4/9d16986e-a4d1-4743-9e8b-fb08d3ae608e/1

### Further improvments

_Since this is your first own web API, there are probably things you would solve in another way, looking back at this assignment. Write your thoughts about this._

In terms of code quality and maintainability, I would try to implement more middleware both in Express and the Mongoose schemas in order to not have to repeat a bunch of code for every route and make the API more scalable. I would implement more pagination/filtering/query possibilities for users of the API. I would probably also use Passport with OpenId connect instead of handling user email/passwords, or just use another service like Firebase for anything dealing with authentication and users. I would also look into better caching solutions if I expected heavy traffic.

### Extras

_Did you do something extra besides the fundamental requirements? Explain them._

- I implemented some filtering and pagination. E.g. /ads can be filtered by query parameters _area_ and _publisher_ and paginated with _\$skip_ and _\$limit_. A response from /ads (which contains 10,000 items) will provide a _totalCount_ and _itemCount_ and a _next_ field with the url to the next page.
- I made sure that HEAD and OPTIONS requests work for all routes with the correct response headers and that any request with an unsupported method returns a 405 response.
- CORS headers are configured so browsers can send requests to the api.
- Database queries triggered by GET requests are cached which means that sending the same request twice will return a 304, but also will not invoke a roundtrip to the database, which makes the response time fast (example GET request to /publishers 40ms/221B cached vs 234ms/200kb for initial request).
- User input is validated and sanitized before saved to the database (e.g. user's can't insert html tags into db fields, which makes consumption of the API safe even if the client forgets to escape html tags.)
- I also added a more robust logging using Winston which saves internal server errors to a specific log file.
- Needless to say - passwords are hashed and salted before stored to the db..

### Feedback

_Feedback to the course management about the assignment._

It was a fun assignment! I already had implemented an api for my own use as a backend to a React app, but this assignment really made me think more about what RESTfulness means and respect how much thought and work that has gone into internet standards. However, it is also a bit frustrating with all the MUSTS, and it is not very fun to have to handle various HTTP methods, headers and query strings when it would be much easier to just handle everything with POST requests containing everything needed in JSON... I guess that's what GraphQL is for :)
