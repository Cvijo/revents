import { Form } from 'semantic-ui-react'
import React from 'react'

const RadioInput = ({ input,  type, label }) => {
    return (
        <Form.Field>
            <div className="ui radio">
                <input {...input} type={type} /> {' '}
                <label>{label}</label>
            </div>
        </Form.Field>
    )
}

export default RadioInput
