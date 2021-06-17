
<!-- ABOUT THE PROJECT -->
## MetriApiClient

This is a minimalist ApiClient to [MetriApi](https://metry.docs.apiary.io/#)

#### Supported operations:

* listMeters: retrieves a list of meters with their consumption information.
* getConsumption: retrieves consumption data for a single meter


### Developed With

This program is developed on top of:

* [NodeJs](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)

## Getting Started
Follow the below steps to setup it up on your own machine.

### Prerequisites

You need npm and node installed on your computer to run this program.

* install node using this [link](https://nodejs.org/en/)
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. You need a valid Metri Api token to use this ApiClient. check out [Metri Api docs ](https://metry.docs.apiary.io/#) on how you can get one.

2. Clone the repo
   ```sh
   git clone https://github.com/fardinhakimi/metry.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a .env file in the root of the project
    ```sh
    touch .env
    ```
4. Enter your METRI_API_URL and METRI_API_KEY in `.env`
   ```JS
   METRI_API_URL= '<METRI_API_URL>'
   METRI_API_KEY= '<METRI_API_KEY>'
   ```
4. build the project (optional)
   ```sh
    npm run build
   ```

## Usage

Run in the root folder
```sh
    npm run test:run
```

## Contact

Fardin Hakimi - fardinhakimi@gmail.com


