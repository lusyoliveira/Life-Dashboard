export default class Clima {
    id
    name
    latitude
    longitude
    elevation
    feature_code
    country_code
    admin1_id
    admin2_id
    timezone
    population
    country_id
    country
    admin1
    admin2

    constructor(_id, name,latitude,longitude,elevation,feature_code,country_code,admin1_id,admin2_id,timezone,population,country_id,country,admin1,admin2,
        current_units = {}, current = {}, daily_units = {}, daily = {}
    ) {
    this.id = _id
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.elevation = elevation;
    this.feature_code = feature_code;
    this.country_code = country_code;
    this.admin1_id = admin1_id;
    this.admin2_id = admin2_id;
    this.timezone = timezone;
    this.population = population;
    this.country_id = country_id;
    this.country = country;
    this.admin1 = admin1;
    this.admin2 = admin2;

    // objetos aninhados
    this.current_units = current_units;
    this.current = current;
    this.daily_units = daily_units;
    this.daily = daily;
    }
}
