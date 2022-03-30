let db;

const request = indexedDB.open('budget_tracker', 1);
console.log(request);

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {
    // save a reference to the db
    const db = event.target.result;
    // create an object store (table) called `new_transaction??`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_transaction', {autoIncrement: true });
    console.log('database: ' + db);
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

// be sure to create a record variable to pass through this function in the index.js file
function saveRecord(record) {
    // open a new txn w/ db and r/w permisions
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    // access the object store for 'new transaction'
    const txnObjectStore = transaction.objectStore('new_transaction');

    // add the new record to the object store
    txnObjectStore.add(record);
}

function uploadTransactions() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const txnObjectStore = transaction.objectStore('new_transaction');

    const getAll = txnObjectStore.getAll()

    getAll.onsuccess = function() {
        fetch('/api/transaction',{
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_transaction'], 'readwrite');
                const txnObjectStore = transaction.objectStore('new_transaction');
                txnObjectStore.clear();

                alert('All saved transactions have been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
    }
}

window.addEventListener('online', uploadTransactions);