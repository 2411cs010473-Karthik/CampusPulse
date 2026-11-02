"""SYNTHETIC demonstration data (template-generated). Not real student feedback."""
import random
CATEGORIES = ["Faculty", "Academics", "Infrastructure", "Hostel", "Placements", "Transportation", "Campus Facilities"]
DEPARTMENTS = ["Computer Science", "Electronics", "Mechanical", "Civil", "Business Administration", "General"]
B = {
"Faculty": {
 "Positive": ["the professors explain difficult concepts very clearly", "faculty members are approachable and always ready to help", "my mentor gives excellent guidance and quick feedback", "lectures use practical examples that keep us engaged"],
 "Negative": ["the professors rush through topics and ignore our doubts", "faculty are rarely available outside class hours", "teaching is boring and slides are just read aloud", "assignment feedback is delayed for weeks"],
 "Neutral": ["the faculty conduct lectures according to the timetable", "each course has one professor and one teaching assistant", "office hours are listed on the department notice board", "classes are held for five days a week"]},
"Academics": {
 "Positive": ["the curriculum is modern and well structured", "the course projects helped me learn real skills", "the laboratory equipment is up to date and well maintained", "exams are fair and the syllabus is clearly defined"],
 "Negative": ["the syllabus is outdated and not industry relevant", "the lab equipment is old and often broken", "the exam schedule is stressful and poorly planned", "too much theory and very little practical work"],
 "Neutral": ["the semester has two internal exams and one final exam", "the lab sessions are scheduled twice a week", "the curriculum includes core and elective subjects", "the course material is shared through the portal"]},
"Infrastructure": {
 "Positive": ["the classrooms are spacious clean and well ventilated", "the library is quiet and has a great collection", "the wifi is fast and reliable across buildings", "the new academic block is excellent"],
 "Negative": ["the classrooms are overcrowded and the projectors fail often", "the wifi keeps disconnecting during online classes", "the washrooms are dirty and poorly maintained", "the library lacks recent books and seating"],
 "Neutral": ["the academic block has four floors", "the library is open from nine to five", "classrooms are allocated by department", "the campus has separate buildings for each school"]},
"Hostel": {
 "Positive": ["the hostel food is tasty and served hot", "the rooms are clean and the staff are friendly", "the hostel is safe and has good security", "the mess menu has great variety"],
 "Negative": ["the hostel food is bland and sometimes unhygienic", "the rooms are dirty and the water supply is unreliable", "the hostel warden ignores our complaints", "the mess serves stale food and the quality is terrible"],
 "Neutral": ["the hostel mess serves breakfast lunch and dinner", "rooms are shared between two students", "the hostel gate closes at ten in the evening", "laundry service is available on weekends"]},
"Placements": {
 "Positive": ["the placement cell brings excellent companies every year", "mock interviews and resume workshops were very helpful", "i received a great offer through campus placements", "the training sessions improved my confidence"],
 "Negative": ["very few good companies visit our campus for placements", "the placement cell gives no support to our department", "the offered packages are low and training is poor", "placement information is shared too late"],
 "Neutral": ["the placement season starts in the seventh semester", "companies conduct an aptitude test followed by interviews", "the placement cell is located in the admin block", "students register for placements through the portal"]},
"Transportation": {
 "Positive": ["the college buses are punctual and comfortable", "bus routes cover all major areas of the city", "the drivers are courteous and drive safely", "the transport fee is affordable for the service"],
 "Negative": ["the buses are always late and overcrowded", "there are not enough routes and the seats are broken", "the drivers drive rashly and the buses are dirty", "the bus schedule changes without any notice"],
 "Neutral": ["the college runs buses on ten routes", "the first bus leaves the campus at seven in the morning", "bus passes are issued every semester", "the transport office is near the main gate"]},
"Campus Facilities": {
 "Positive": ["the sports complex is well equipped and open late", "the canteen offers tasty and affordable meals", "the medical center responds quickly and the doctors are caring", "the campus is green clean and peaceful"],
 "Negative": ["the canteen is expensive and the food quality is poor", "the sports ground is poorly maintained and equipment is missing", "the medical center is understaffed and always closed", "there are not enough drinking water points"],
 "Neutral": ["the campus has a canteen a bank and a medical center", "the sports complex has a gym and a basketball court", "the stationery shop is next to the library", "the campus has an auditorium for events"]},
}
OPEN = {"Positive": ["", "honestly ", "overall ", "i feel that "], "Negative": ["", "sadly ", "unfortunately ", "i feel that "], "Neutral": ["", "as of now ", "to note ", "i observed that "]}
CLOSE = {"Positive": ["", " keep it up", " i am very happy", " thank you"], "Negative": ["", " this needs urgent attention", " please fix this", " i am disappointed"], "Neutral": ["", " this is the current setup", " nothing more to add", " as per the notice"]}

def make_samples(n, seed):
    """Balanced across sentiments; categories cycle evenly."""
    rnd = random.Random(seed); rows = []
    sents = ["Positive", "Negative", "Neutral"]
    for i in range(n):
        s = sents[i % 3]; c = CATEGORIES[(i // 3) % 7]
        t = rnd.choice(OPEN[s]) + rnd.choice(B[c][s]) + rnd.choice(CLOSE[s])
        rows.append({"feedback": t[0].upper() + t[1:] + ".", "category": c, "department": rnd.choice(DEPARTMENTS), "label": s})
    return rows
