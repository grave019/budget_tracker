// declare global variables 
let db;
let budgetVersion;
//initializing the database
const request = indexedDB.open('BudgetDB', budgetVersion || 21);

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