//schedule maker with day of the week, end time, start time, name

function newCourse(startTime, endTime, name){
	let obj = {
		color: `rgb(${random(100,255)},0,${random(50,255)})`,
		startTime: startTime,
		endTime: endTime,
		name: name
	}
	return obj;
}

function newSchedule(owner){
	let obj = {
		owner: owner,
		days: {
			Mon: [],
			Tue: [],
			Wed: [],
			Thu: [],
			Fri: [],
			Sat: [],
			Sun: []
		},
		addCourse: function(course, dayOfWeek){
			for (let l in dayOfWeek) {
				let day = dayOfWeek[l]
				obj.days[day].push(course)
				var length = obj.days[day].length;
				  
				for(var i = 1, j; i < length; i++) {
					var temp = obj.days[day][i];
						for(var j = i - 1; j >= 0 && obj.days[day][j].startTime > temp.startTime; j--) {
							obj.days[day][j+1] = obj.days[day][j];
						}
					obj.days[day][j+1] = temp;
				}
			}
		}
	};
	return obj
}

function findBreaks(schedule, days, first){
	for (let i in schedule.days){
		let day = schedule.days[i]
		let breaks = []
		let startBreak = 600
		let endBreak = 2400
		for(let j in day){
			let course = day[j]
			endBreak = course.startTime
			if(endBreak <= startBreak){
				startBreak = course.endTime
				continue;
			}
			breaks.push({
				start: startBreak,
				end: endBreak
			})
			startBreak = course.endTime
			
		}
		if(endBreak < 2400){
			breaks.push({
				start: startBreak,
				end: 2400
			})
		}
		if(first) {
			days[i].first = breaks;
		} else {
			days[i].second = breaks;
		}
	}
	return days;
}

function reverseScheduleIntersection(firstSchedule, secondSchedule){
	
	let eD = () => {
		return {first: {}, second: {}, intersect: {}}
	}
	let days = {
		Mon: eD(),
		Tue: eD(),
		Wed: eD(),
		Thu: eD(),
		Fri: eD(),
		Sat: eD(),
		Sun: eD()
	};
	days = findBreaks(firstSchedule, days, true);
	days = findBreaks(secondSchedule, days, false);
	
	for(let l in days){
		let today = days[l]
		let times = []
		for( let j in today.first ) {
			times.push(today.first[j])
		}
		for( let j in today.second ) {
			times.push(today.second[j])
		}
		var length = times.length;
		  
		for(var i = 1, j; i < length; i++) {
			var temp = times[i];
				for(var j = i - 1; j >= 0 && times[j].start > temp.start; j--) {
					times[j+1] = times[j];
				}
			times[j+1] = temp;
		}
		// we have sorted the thing
		let breaks = []
		let startBreak = 600
		let endBreak = 2400
		for(let j in times){
			let time = times[j]
			endBreak = time.start
			if(endBreak <= startBreak){
				startBreak = time.end
				continue;
			}
			breaks.push({
				start: startBreak,
				end: endBreak
			})
			startBreak = time.end
			
		}
		if(endBreak < 2400){
			breaks.push({
				start: startBreak,
				end: 2400
			})
		}
		days[l].intersect = breaks
	}
	
	console.log(days)
	
	
}

function populate(){
	let mySchedule = newSchedule("Andrey")
	let firstCourse = newCourse(900, 1100, "Calculus")
	let secondCourse = newCourse(1100, 1230, "French Literature") 
	let thirdCourse = newCourse(730, 830, "Andrey Studies")
	mySchedule.addCourse(firstCourse, ["Mon", "Tue", "Thu"])
	mySchedule.addCourse(secondCourse, ["Mon", "Tue", "Thu", "Fri"])
	mySchedule.addCourse(thirdCourse, ["Mon", "Tue", "Thu", "Wed", "Sat"])

	let aSchedule = newSchedule("Alisa")
	let fCourse = newCourse(900, 1130, "Calculus")
	let sCourse = newCourse(1200, 1210, "French Literature") 
	let tCourse = newCourse(530, 730, "Andrey Studies")
	let eCourse = newCourse(830, 930, "Andrey Class")
	aSchedule.addCourse(fCourse, ["Mon", "Tue", "Thu"])
	aSchedule.addCourse(sCourse, ["Mon", "Tue", "Thu", "Fri"])
	aSchedule.addCourse(tCourse, ["Mon", "Tue", "Thu", "Wed", "Sat"])
	aSchedule.addCourse(eCourse, ["Mon", "Tue", "Thu", "Fri", "Sat", "Wed"])
	renderSchedule(aSchedule, body)
	reverseScheduleIntersection(mySchedule, aSchedule)
}

function create(obj) {
	return document.createElement(obj);
}

function add(a, tob) {
	tob.appendChild(a)
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function renderSchedule(schedule, location, whichDiv){
	let width = (50/7)
	let daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
	for(let i in daysOfWeek){
		let day = daysOfWeek[i]
		let left =   `${(i*(width))}%`
		let height = `${(20/50)}%`
		let top = `${whichDiv*50}%`
		console.log(left)
		let header = create("div")
		header.style.height = height
		header.style.left = left
		header.style.width = `${width-0.5}%` 
		header.style.top = top
		header.style.backgroundColor = "grey"
		header.innerHTML = day
		header.style.textAlign = 'center'
		header.style.position = 'absolute'
		add(header, location)
		let courses = schedule.days[day]
		for(let j in courses){
			let theCourse = courses[j]
			let height = `${(theCourse.endTime - theCourse.startTime)*height}%` 
			let top = 100 + theCourse.startTime -500
			let div = create("div")
			div.style.position = "absolute"
			div.style.height = height
			div.style.width = `${width-0.5}%` 
			div.style.left = left
			div.style.top = top
			div.style.backgroundColor = theCourse.color;
			div.innerHTML = theCourse.name
			div.style.textAlign = 'center'
			div.style.lineHeight = `${height}px`
			add(div, location)
		}
	}
	console.log(schedule)
}

let body = undefined

window.onload  = () => {
	body = document.getElementById("mainbody")
	populate()
}



	