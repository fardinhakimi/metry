
<!-- ABOUT THE PROJECT -->
## MetryApiClient

This is a minimalist ApiClient to [MetryApi](https://metry.docs.apiary.io/#)

#### Supported operations:

* getMeters: retrieves a list of meters with their consumption information.
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

1. You need a valid Metry Api token to use this ApiClient. check out [Metry Api docs ](https://metry.docs.apiary.io/#) on how you can get one.

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
5. Enter your METRY_API_URL and METRY_API_TOKEN in `.env`
   ```JS
   METRY_API_URL= '<METRY_API_URL>'
   METRY_API_TOKEN= '<METRY_API_TOKEN>'
   ```
6. build the project (optional)
   ```sh
    npm run build
   ```
7. run the example
   ```sh
   npm run test:run
   ```
## Usage
Look in src/index.ts for an example of how to use the client.

## Contact

Fardin Hakimi - fardinhakimi@gmail.com


