# Cinema Ticket Booking Service

Cinema Ticket Booking service is used to book tickets to cinema. It calculates the total amount for type of tickets requested along with the seats to be reserved considering the business rules. Once the final amount is calculated it  reserves seats over third party APIs and then makes payment which is again third party APIs.

## Table of contents

* Setup Instructions
* Building
* Testing
* Coverage
* Pipeline
* Security Checks
* Update dependancies
* Compliance

## Setup Instructions

### Pre-requisites
Install Node (v20 or higher) by following instaructions on the https://nodejs.org/en/download
according to the OS, desired package manager and version manager.

Clone the repository from https://github.com/siddshroff/cinema-tickets-javascript-412645.git. 
Open it in VSCode or any other appropriate IDE.

Once all the pre-requisites are downloaded and installed in your machine it is ready to be build and tested.

## Building

Clean install the project:
```
npm ci
```

## Testing
Unit testing the code
Run:
```
npm run test:unit
```

## Coverage
Checking code coverage in unit tests(TDD)
Run:
```
npm run test:coverage
```

## Pipeline
Run pipeline to check how it would run pipeline jobs after commit
Run:
```
npm run pipeline
```

## Security Checks
Check for any vulnerability in the package along with thrid party libraries and transitive dependancies
Run:
```
npm run security
```

## Compliance Checks

Before raising pull request, run this command to avoid pipeline failures\
Run:
```
npm run security
```

## Update dependencies

Before updating and running update commands ensure dependencies are stable LTS versions\
**To display updates**
```
npm run security:outdated
```

**To apply patches/updates**\
```
rm -rf node_modules package-lock.json
npm install

```