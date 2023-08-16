import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Checkbox,
  Row,
  Col,
  Typography,
} from 'antd';
import { logIn, signUp } from '../../services/apiRequest';
import { IRegistrationForm } from '../../types/types';
import convertFormData from '../../utils/convertFormData';
import { fieldsProps, tailFormItemLayout } from './fieldsProps';
import BillingAddress from './BillingAddress';
import { RootState } from '../../redux/store';
import { loginReducer } from '../../redux/slices/authorizationSlice';

const signupError = 'DuplicateField';

const { Option } = Select;

function Registration(): JSX.Element {
  const [form] = Form.useForm();
  const [isAdressSingle, setIsAdressSingle] = useState(true);
  const [isSignupError, setSignupError] = useState(false);

  const navigate = useNavigate();

  const authorization = useSelector<RootState>(
    (state) => state.authorization.isLoggedIn,
  );

  const dispatch = useDispatch();

  const onFinish = (values: IRegistrationForm) => {
    signUp(convertFormData(values))
      .then(() =>
        logIn(values.email, values.password)
          .then(() => {
            dispatch(loginReducer(true));
            navigate('/');
          })
          .catch(console.log),
      )
      .catch((err) => {
        const errorMessage = err.body.errors[0].code;
        if (errorMessage === signupError) {
          setSignupError(true);
        }
        console.log(err);
      });
  };

  useEffect(() => {
    if (authorization) {
      navigate('/');
    }
  }, [authorization]);

  return (
    <Form {...fieldsProps.form.props} form={form} onFinish={onFinish}>
      <h1 style={{ textAlign: 'center' }}>Create Account</h1>

      <Form.Item
        {...fieldsProps.email.props}
        validateStatus={isSignupError ? 'error' : ''}
      >
        <Input placeholder="E-mail" onChange={() => setSignupError(false)} />
      </Form.Item>

      {isSignupError && (
        <Form.Item {...tailFormItemLayout}>
          <Typography.Text type="danger">
            An account with such an email already exists, you can use another
            email or log in to your account
          </Typography.Text>
        </Form.Item>
      )}

      <Form.Item {...fieldsProps.password.props}>
        <Input.Password />
      </Form.Item>

      <Form.Item
        {...fieldsProps.confirm.props}
        rules={[
          ...fieldsProps.confirm.rules,
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('Passwords do not match, please try again'),
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...fieldsProps.firstName.props}>
        <Input placeholder="First name" />
      </Form.Item>

      <Form.Item {...fieldsProps.lastName.props}>
        <Input placeholder="Last name" />
      </Form.Item>

      <Form.Item
        {...fieldsProps.birthday.props}
        rules={[
          ...fieldsProps.birthday.rules,
          () => ({
            validator(_, value) {
              if (Date.now() - value.$d.getTime() > 378691200000) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  'Sorry, only users aged 12 or older can create an account',
                ),
              );
            },
          }),
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item {...fieldsProps.oneAddress.props}>
        <Checkbox
          defaultChecked={isAdressSingle}
          onChange={() => setIsAdressSingle(!isAdressSingle)}
        >
          Use the same address for both billing and shipping default
        </Checkbox>
      </Form.Item>

      {!isAdressSingle && (
        <h3 style={{ textAlign: 'center' }}>Address for shipping</h3>
      )}

      <Form.Item {...fieldsProps.country.props}>
        <Select placeholder="Please select a country">
          <Option value="US">U.S.A</Option>
          <Option value="RU">Russia</Option>
        </Select>
      </Form.Item>

      <Form.Item
        {...fieldsProps.postalCode.props}
        rules={[
          ...fieldsProps.postalCode.rules,
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (getFieldValue('country') === 'US') {
                if (value.length === 5) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Postal code must contain 5 digits'),
                );
              }
              if (getFieldValue('country') === 'RU') {
                if (value.length === 6) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Postal code must contain 6 digits'),
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input placeholder="Postal code" />
      </Form.Item>

      <Form.Item {...fieldsProps.city.props}>
        <Input placeholder="City" />
      </Form.Item>

      <Form.Item {...fieldsProps.street.props}>
        <Input placeholder="Street" />
      </Form.Item>

      {!isAdressSingle && <BillingAddress />}

      <Form.Item {...tailFormItemLayout}>
        <Row gutter={16}>
          <Col span={6}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={() => navigate('/login')}>
              Log in
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
}

export default Registration;