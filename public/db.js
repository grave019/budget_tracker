// declare global variables 
let db;
let budgetVersion;

//initializing the database
const request = indexedDB.open('BudgetDB', budgetVersion || 21);

//check for changes to the database
request.onupgradeneeded = function (event) {
    console.log('Upgrade needed in IndexDB');
    const {
        oldVersion
      } = event
      const newVersion = event.newVersion || db.version;
    
      console.log(`DB updated from version ${oldVersion} to ${newVersion}`);
    
      db = event.target.result;
    
      if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {
          autoIncrement: true
        });
      }   
    };
    request.onerror = function (event) {
        console.log(`${event.target.errorCode}`)
      };
      
      function checkDB() {
        console.log('check db invoked');
      
        let transaction = db.transaction(['BudgetStore'], 'readwrite');
      
        const store = transaction.objectStore('BudgetStore');
      
        const getAll = store.getAll();
        getAll.onsuccess = function () {

            if (getAll.result.length > 0) {
              fetch('/api/transaction/bulk', {
                  method: "POST",
                  body: JSON.stringify(getAll.result),
                  headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                  },
                })
                .then((response) => response.json())
                .then((res) => {
                  if (res.length !== 0) {
        
                    transaction = db.transaction(['BudgetStore'], 'readwrite');
        
                    const currentStore = transaction.objectStore('BudgetStore');
        
                    currentStore.clear();
                    console.log('Clearing store');
                  }
                });
            }
          }
    }
    
    request.onsuccess = function (event) {
        console.log('success');
        b = event.target.result;
          
        if (navigator.onLine) {
        console.log('Back online!');
        checkDB();
        }
    };
          
    const saveRecord = (record) => {
        console.log('Record saved');
          
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
          
    const store = transaction.objectStore('BudgetStore');
          
        store.add(record);
    };
          
    window.addEventListener('online', checkDB);