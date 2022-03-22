let db;

const request = indexedDB.open('budget_tracker', 1);

// this event will emit if the database version changes
request.onupgradedneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store (table) called `new_transaction??`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_transaction_list', {autoIncrement: true });
};

// upon a successful
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadTransactions??() function to send all local db data to api
    if (navigator.onLine) {
        // haven't created this yet:
        // uploadTransactions();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

