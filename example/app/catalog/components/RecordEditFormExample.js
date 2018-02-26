/* @flow */
import React from 'react';
import {
  RecordEditForm, InputField, Button
} from '../../../../src';

const RecordEditFormExample = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div className={ className }>
      <div className="slds-p-vertical--small">
        <h3>Record Edit Form (Create new Opportunity record)</h3>
        <RecordEditForm objectApiName="Opportunity">
          <InputField fieldName="Name" />
          <InputField fieldName="AccountId" />
          <InputField fieldName="Type" />
          <InputField fieldName="Amount" />
          <InputField fieldName="CloseDate" />
          <div className="slds-p-vertical--small" />
          <Button type="submit" variant="brand">Create</Button>
        </RecordEditForm>
      </div>
    </div>
  );
}

export default RecordEditFormExample;
