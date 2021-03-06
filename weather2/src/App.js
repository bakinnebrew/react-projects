import React from 'react'
import './App.css'

class WeatherCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      day: '',
      city_name: '',
      temperature: 0,
      wind_speed: 0,
    }
  }
  render() {
    return (
      <div id="weather-card">
        <h3> {this.props.city_name} </h3>
        <div id="weather-prop"> {this.props.day_of_week} </div>
        <div id="weather-prop-temp"> {this.props.temperature} </div>
        <div id="weather-prop"> {this.props.wind_speed} </div>
      </div>
    )
  }
}

class WeatherCard5Day extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Days: [],
      gotarray: 0,
      search: this.props.search,
    }
  }

  componentDidMount() {
    if (this.state.gotarray === 0) {
      this.get5DayArray()
    }
  }

  render() {
    return (
      <div>
        <h2>{this.props.search} 5-Day Forecast</h2>
        {this.state.Days.map((Day) => {
          return (
            <WeatherCard day_of_week={Day.day} temperature={Day.temperature} />
          )
        })}
      </div>
    )
  }

  get5DayArray = () => {
    const search = this.state.search

    fetch(
      `https://community-open-weather-map.p.rapidapi.com/forecast?q=${search}&units=imperial`,
      {
        headers: {
          'x-rapidapi-key': process.env.REACT_APP_API_KEY,
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
        },
      },
    )
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        console.log('json', json)

        let day_temp = new Array(5)

        day_temp[0] = json.list[0].main.temp
        day_temp[1] = json.list[5].main.temp
        day_temp[2] = json.list[13].main.temp
        day_temp[3] = json.list[21].main.temp
        day_temp[4] = json.list[29].main.temp

        let d = new Date()
        let weekday = new Array(7)

        weekday[0] = 'SUN'
        weekday[1] = 'MON'
        weekday[2] = 'TUE'
        weekday[3] = 'WED'
        weekday[4] = 'THUR'
        weekday[5] = 'FRI'
        weekday[6] = 'SAT'

        var new_arr = []

        for (var i = 0; i < 5; i++) {
          var day = weekday[d.getDay() + i]
          var temp = day_temp[i]
          new_arr.push({ day: day, temperature: Math.round(temp) })
        }
        this.setState({
          gotarray: 1,
          Days: new_arr,
        })
        console.log(this.state.gotarray)
        console.log(new_arr)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      day_of_week: 'MON',
      search: '',
      city: '',
      forecast: '',
      temperature: 65,
      fiveDay: 0,
    }
  }
  componentDidMount() {
    this.getWeekday()
  }

  render() {
    if (this.state.fiveDay === 1) {
      var weatherView = <WeatherCard5Day search={this.state.search} />
      var buttontoggle = 'Current Weather'
    } else {
      var weatherView = (
        <WeatherCard
          day_of_week={this.state.day_of_week}
          temperature={this.state.temperature}
        />
      )
      var buttontoggle = '5-Day Forecast'
    }
    return (
      <div>
        <h1> Weather App </h1>
        <input
          type="text"
          placeholder="e.g., Atlanta"
          onKeyPress={this.inputKeyPress}
          onChange={this.updateResponse}
          value={this.state.search}
        />
        <h3 id="current-forecast"> Current Forecast: {this.state.forecast}</h3>
        <div>{weatherView}</div>
        <button id="DayViewButton" onClick={this.ToggleDayView}>
          {' '}
          {buttontoggle}{' '}
        </button>
      </div>
    )
  }

  inputKeyPress = (event) => {
    if (event.key === 'Enter') {
      const search = this.state.search

      fetch(
        `https://community-open-weather-map.p.rapidapi.com/weather?q=${search}&lang=null&units=imperial`,
        {
          headers: {
            'x-rapidapi-key': process.env.REACT_APP_API_KEY,
            'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
          },
        },
      )
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          console.log('json', json)
          console.log(json.main.temp)
          this.setState({
            temperature: Math.round(json.main.temp),
            forecast: json.weather[0].main,
          })
        })
        .catch((err) => {
          console.error(err)
          this.setState({
            forecast: 'No Results Found',
          })
        })
    }
  }

  updateResponse = (event) => {
    this.setState({
      search: event.target.value,
    })
  }

  getWeekday = () => {
    let d = new Date()
    let weekday = new Array(7)
    weekday[0] = 'SUN'
    weekday[1] = 'MON'
    weekday[2] = 'TUES'
    weekday[3] = 'WED'
    weekday[4] = 'THUR'
    weekday[5] = 'FRI'
    weekday[6] = 'SAT'

    let n = weekday[d.getDay()]
    this.setState({
      day_of_week: n,
    })
  }

  ToggleDayView = () => {
    if (this.state.fiveDay === 0) {
      var value = 1
    } else {
      var value = 0
    }
    this.setState({
      fiveDay: value,
    })
  }
}

export default App
