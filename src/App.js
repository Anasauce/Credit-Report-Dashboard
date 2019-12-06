import React, { Component, useState, useEffect, useCallback } from 'react';
import arrow from './arrow.svg'
import fetch from 'isomorphic-fetch';
import folderOpenRegular from './folderOpenRegular.svg';
import logo from './logo.svg';
import { BACKEND_SERVER_PORT } from './constants';
import './App.css';


class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="header">
					<img src={logo} className="header__logo" alt="logo" />
					<h1 className="header__title">Sample Credit Report Dashboard</h1>
				</header>
				<Dashboard />
			</div>
		);
	}
}

export default App;

const Dashboard = () => {
	const [data, setData] = useState({ reports: [], count: 10});

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`http://localhost:${BACKEND_SERVER_PORT}/api/requests?count=${data.count}&cursor=2010-11-12T02:18:22.094Z`);
			const result =  await response.json();
			setData({
				count: data.count,
				reports: result.reports,
			});
	   
	   }
	   fetchData();
	}, [data.count]);

	const handleShowMoreClick = useCallback(() => {
		const updateCount = () => {
			const { count } = data;
			const newCount = count + 10;
			setData({
				reports: data.reports,
				count: newCount
			})
		}
		updateCount();
	}, [data]) 

	return (
		<div className="dashboard">
			<DashboardHeader />
			<ul className="dashboard-row__list">
				{data.reports.map(user => (
					<li key={user.id}>
						<DashboardRow 
							photo={user.img.thumb}
							score={user.score}
							first={user.firstName}
							last={user.lastName}
							social={user.ssn}
							dob={user.dob}
							id={user.id}
						/>
					</li>
				))}
			</ul>
			<div className="dashboard__show-more-section">
				<p className="dashboard__show-more-section__count">showing reports 1 - {data.count}</p>
				<button className="dashboard__show-more-section__button" onClick={handleShowMoreClick}>SHOW MORE REPORTS</button>
				<a href="#dashboard-header-id">
					<img src={arrow} className="dashboard__back-to-top" alt="archive-logo" />
				</a>
			</div>
		</div>
	)
}

const DashboardHeader = () => {
	return (
		<div className="dashboard-header" id="dashboard-header-id">
			<div></div>
			<h3 className="dashboard-header__score">Credit Score</h3>
			<h3 className="dashboard-header__first-name">First</h3>
			<h3 className="dashboard-header__last-name">Last</h3>
			<h3 className="dashboard-header__dob">Date of Birth</h3>
			<h3 className="dashboard-header__social">Social Security</h3>
			<h3 className="dashboard-header__archive">Archive</h3>
		</div>

	)
}

const DashboardRow = (props) => {
	const { photo, score, first, last, dob, social, id } = props;
	const [archive, setArchive] = useState(false);
	
	const handleArchiveClick = useCallback(() => {
		const archiveReport =  async () => {
			const response = await fetch(`http://localhost:${BACKEND_SERVER_PORT}/api/requests/archive/`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({id: id})
			})
			const archived = response.status === 200 ? true : false
			setArchive(archived);
		}	
		archiveReport();
	}, [archive]) 

	return (
			<div className={ !archive ? "dashboard-row" : "dashboard-row--archived"}>
				<img src={photo} className="dashboard-row__photo" alt="user-img" />
				<p className="dashboard-row__score">{score} </p>
				<p className="dashboard-row__first-name">{first}</p>
				<p className="dashboard-row__last-name">{last}</p>
				<p className="dashboard-row__dob">{dob}</p>
				<p className="dashboard-row__social">{social}</p>
				<img src={folderOpenRegular} onClick={handleArchiveClick} className="dashboard-row__archive-logo" alt="archive-logo" />
			</div>
	)
}
