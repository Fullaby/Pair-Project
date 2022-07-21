function createdAtFormatter (date) {
  let today = new Date()
  let nowDay = today.getDate()
  let nowHour = today.getHours()
  let nowMinute = today.getMinutes()

  let postedDay = date.getDate()
  let postedHour = date.getHours()
  let postedMinutes = date.getMinutes()

  let dayDif = nowDay - postedDay
  let hourDif = nowHour - postedHour
  let minuteDif = nowMinute = postedMinutes

  if (dayDif === 0 && hourDif === 0) {
    return `${minuteDif} MINUTES AGO`
  } else if (dayDif === 0 && hourDif > 0 ) {
    return `${hourDif} HOURS AGO`
  } else {
    return `${dayDif} DAYS AGO`
  }
}

module.exports = createdAtFormatter