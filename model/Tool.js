module.exports = function (id, name, price, location) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.location = location;
    this.json = function () { 
        return {
            'id': this.id,
            'name': this.name,
            'price': this.price,
            'location': this.location
            };
    }
}