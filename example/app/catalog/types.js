/* @flow */
export type State = {
  values: Array<{
    id: string,
    value: string,
  }>,
};

export type Action =
  | { type: 'CHANGE_VALUE', payload: { index: number, value: string } }
  | { type: 'ADD_INPUT', payload: { index?: number, value: string } }
  | { type: 'REMOVE_INPUT', payload: { index: number } }
