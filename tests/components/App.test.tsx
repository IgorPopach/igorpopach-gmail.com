import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import { History } from 'history';

import { App } from '../../src/containers/App/App';

jest.mock('../../src/firebase', () => ({}));

type Props = React.ComponentProps<typeof App>;

describe('<App />', () => {
    const props: Props = {
        isLoading: false,
        user: null,
        initialize: jest.fn(),
        history: {} as History,
        logoutAction: jest.fn() as Props['logoutAction'],
    };
    let wrapper: ShallowWrapper<Props>;

    beforeAll(() => {
        wrapper = shallow(<App {...props} />);
    });

    it('Should have correct layout', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
