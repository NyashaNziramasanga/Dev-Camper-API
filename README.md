# 📖 Dev-Camper-API 📖

Backend API for DevCamper application, which is a bootcamp directory website

## Postman Docs

DevCamper Postman API documentation [here](https://documenter.getpostman.com/view/9366343/SWTK3ZQF?version=latest)

![postman-docs](images/postman-docs.png)

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

```bash
# Install Dependencies
$ npm install

# Run in dev mode
$ npm run dev

# Run in prod mode
$ npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```bash
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## References

- [BradTraversy devcamper-api](https://github.com/bradtraversy/devcamper-api)
