import React from "react";
import { motion } from "framer-motion";
import CvPicture from "./CvPicture";
import { cvData } from "../data/cvData";

const Cv: React.FC = () => {
	return (
		<div className='flex flex-col items-center w-full md:pt-20'>
			<CvPicture />
			<div className='flex flex-col justify-center items-center'>
				<motion.div
					className='w-full md:w-1/2 bg-gray-800 rounded-sm p-4 mb-10 pb-8 opacity-80 backdrop-blur-md md:text-xl'
					initial={{ y: 1300 }}
					animate={{ y: 0 }}
					exit={{ y: 1300, transition: { delay: 0.3 } }}
					transition={{ duration: 1 }}
				>
					{/* Work Section */}
					<div className='group'>
						<h2 className='text-xl md:text-3xl md:pb-5 group-hover:text-red-500 transition-colors duration-300'>
							<strong>{cvData.work.title}</strong>
						</h2>

						{[...cvData.work.positions].reverse().map((position, positionIndex, positions) => (
							<div
								key={positionIndex}
								className={`${positionIndex > 0 ? "mt-8" : ""} group/job`}
							>
								<p className='md:text-2xl group-hover/job:text-red-500 transition-colors duration-300'>
									<strong>{position.company}</strong> {position.period}
								</p>
								<p>{position.description}</p>

								<h3 className='text-lg text-justify text-white mt-4 md:text-2xl group-hover/job:text-red-500 transition-colors duration-300'>
									<strong>Main technologies:</strong>
								</h3>
								<ul className='list-disc ml-6 mt-2 space-y-1'>
									{position.mainTechnologies.map((tech, techIndex) => (
										<li key={techIndex}>{tech}</li>
									))}
								</ul>

								<p className='text-lg text-justify text-white mt-4 md:text-2xl group-hover/job:text-red-500 transition-colors duration-300'>
									<strong>Impact:</strong>
								</p>
								<ul className='list-disc ml-6 mt-2 space-y-1'>
									{position.impact.map((impact, impactIndex) => (
										<li key={impactIndex}>
											{impact.description} <br />
											{impact.note && <em>{impact.note}</em>}
										</li>
									))}
								</ul>
								{position.initiatives && (
									<>
										<p className='text-lg text-justify text-white mt-4 md:text-2xl group-hover/job:text-red-500 transition-colors duration-300'>
											<strong>Initiatives:</strong>
										</p>
										<ul className='list-disc ml-6 mt-2 space-y-1'>
											{position.initiatives.map((initiative, initiativeIndex) => (
												<li key={initiativeIndex}>{initiative}</li>
											))}
										</ul>
									</>
								)}
								{positionIndex < positions.length - 1 && <hr className='my-8' />}
							</div>
						))}
					</div>

					<hr className='my-5' />

					{/* Education Section */}
					<div className='group'>
						<h2 className='text-xl md:text-3xl md:pb-5 group-hover:text-red-500 transition-colors duration-300'>
							<strong>{cvData.education.title}</strong>
						</h2>
						<p>
							{cvData.education.description} <br />
							{cvData.education.additionalInfo}
						</p>
						<ul className='list-disc ml-6 mt-2 space-y-1'>
							{cvData.education.projects.map((project, index) => (
								<li key={index}>{project}</li>
							))}
						</ul>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Cv;
