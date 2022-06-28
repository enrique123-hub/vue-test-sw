//lightweight indexedDB library courtesy of CryptOpenSource
//feel free to reach out to me via telegram!
const connect = (version) => {
    return new Promise((resolve, reject) => {
        let request;
        if (!version) {
            //This builds the initial BDDB database and checks for version
            request = indexedDB.open("BDDB");
        }
        else {
            //updates the version as stores are added to the database
            request = indexedDB.open("BDDB", version);
        }
        request.onsuccess = () => {
            resolve(request.result);
        }
        request.onerror = (error) => {
            reject(error);
        }
        request.onupgradeneeded = () => {
            resolve(request.result);
        }
    });
};
  
const addStore = (store) => {
    //my strategy for store names is all lower case no special characters
    //when we get to adding records to the store, 
    //I'll share how I maintain the input store name
    let storeName = store.toLowerCase().replace(/\s/g,'_');
    // storeName = storeName.replace(/[&\/\\#,+()$~%.'":*?<>{}!]/g,'');
    return new Promise((resolve, reject) => {
        if (storeName.charAt(0) >= 0 || storeName.charAt(0) <= 9) {
            return reject("Store Cannot Start With A Number!");
        }
        //establish a connection to Indexed DB with the connect function above
        //this first connection is only to get the BDDB Version
        connect()
        .then(db => {
            if (Object.values(db.objectStoreNames).indexOf(store) >= 0) {
                db.close();
                reject("This Store Already Exists!!");
            }
            else {
                //we get the version and then close that connection to the IDB.
                let version = db.version + 1;
                db.close();
                //connect again, this time using the updated version number
                connect(version)
                .then(db => {
                    let objectStore = db.createObjectStore(storeName)
                    //always remember to close your connection!
                    db.close();
                    resolve(objectStore);
                })
                .catch(error => {
                    reject(error);
                });
            }
            resolve(storeName);
        })
        .catch(error => {
            reject(error);
        });
    });
};
  
export {
    addStore,
};
