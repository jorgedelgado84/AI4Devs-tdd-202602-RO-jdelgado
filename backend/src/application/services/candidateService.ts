import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';

export const addCandidate = async (candidateData: any) => {
    try {
        validateCandidateData(candidateData);
    } catch (error: any) {
        throw new Error(error);
    }

    const candidate = new Candidate(candidateData);

    let savedCandidate: any;
    try {
        savedCandidate = await candidate.save();
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new Error('The email already exists in the database');
        }
        throw error;
    }

    const candidateId = savedCandidate.id;

    if (candidateData.educations) {
        for (const education of candidateData.educations) {
            const educationModel = new Education(education);
            educationModel.candidateId = candidateId;
            try {
                await educationModel.save();
            } catch (error: any) {
                if (error.code === 'P2002') {
                    throw new Error('Education record already exists for this candidate');
                }
                throw error;
            }
            candidate.education.push(educationModel);
        }
    }

    if (candidateData.workExperiences) {
        for (const experience of candidateData.workExperiences) {
            const experienceModel = new WorkExperience(experience);
            experienceModel.candidateId = candidateId;
            try {
                await experienceModel.save();
            } catch (error: any) {
                if (error.code === 'P2002') {
                    throw new Error('Work experience record already exists for this candidate');
                }
                throw error;
            }
            candidate.workExperience.push(experienceModel);
        }
    }

    if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
        const resumeModel = new Resume(candidateData.cv);
        resumeModel.candidateId = candidateId;
        await resumeModel.save();
        candidate.resumes.push(resumeModel);
    }

    return savedCandidate;
};
