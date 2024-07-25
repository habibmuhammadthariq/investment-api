export class BaseRepository {
    constructor(db, name) {
        this.db = db;
        this.name = name;
    }
    collection() {
        return this.db.collection(this.name);
    }
}
