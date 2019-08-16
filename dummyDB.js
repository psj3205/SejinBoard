module.exports = (() => {
    var DummyDB = {};
    var storage = [];
    var count = 1;

    DummyDB.get = (id) => {
        if (id) {
            id = (typeof id == 'string') ? Number(id) : id;

            for (var i in storage) if (storage[i].id == id) {
                console.log("안으로??");
                return storage[i];
            }
        }
        else {
            return storage;
        }
    };

    DummyDB.insert = (data) => {
        data.id = count++;
        storage.push(data);
        return data;
    };

    DummyDB.remove = (id) => {
        id = (typeof id == 'string') ? Number(id) : id;

        for (var i in storage) if (storage[i].id == id) {
            storage.splice(i, 1);
            return true;
        }

        return false;
    }

    return DummyDB;
})();