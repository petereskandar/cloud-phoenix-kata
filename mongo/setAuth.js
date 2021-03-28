db.createUser(
    {
      user: "root",
      pwd: "root",
      roles: [
         { role: "dbOwner", db: "demoDB" }
      ]
    },
    {
        w: "majority",
        wtimeout: 5000
    }
);
db.createCollection("logs");