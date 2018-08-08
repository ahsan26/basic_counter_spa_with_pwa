export default know => {
    var request = indexedDB.open('counter-data');
    var db;
    request.onsuccess = (e) => {
        db = e.target.result;
        checkPreviousCounter()
            .then(n => {
                know(n, updateCounter, db);
            })
            .catch(err => {
                updateCounter(0);
                know(0, updateCounter, db);
            });
    };

    function updateCounter(n, dbRef) {
        console.log('updateCounter', n, dbRef);
        var transaction;
        if (dbRef) {
            console.log(1);
            transaction = dbRef.transaction('counter', 'readwrite');
        } else {
            console.log(2);
            transaction = db.transaction('counter', 'readwrite');
        }
        let store = transaction.objectStore('counter');
        store.put({ id: 0, counter: n });
    }

    function checkPreviousCounter() {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction('counter', 'readonly');
            let store = transaction.objectStore('counter');
            let resultReq = store.get(0);
            resultReq.onsuccess = function (e) {
                var result = e.target.result;
                if (result != undefined && result.counter !== 0) resolve(result.counter);
                return reject(false);
            }
        });
    }

    request.onupgradeneeded = (e) => {
        db = e.target.result;
        if (!db.objectStoreNames.contains('counter')) {
            var objectStore = db.createObjectStore('counter', { keyPath: 'id', autoIncrement: true });
        }
    }

    request.onerror = (err) => {
        console.log('Error When Opening DB', err);
    };
    return updateCounter;
}