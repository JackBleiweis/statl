import React, { useState } from 'react';

const ScoreSubmissionForm = (props) => {
    const { onSubmit, gauntletScore } = props;
    const [name, setName] = useState('')

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name,
            score: gauntletScore,
            formattedDate
        }
        console.log(data)
        onSubmit(data)
        setName('')
    }

    return (
        <div>
            <form className="add-score" onSubmit={handleSubmit}>
                <label>Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default ScoreSubmissionForm