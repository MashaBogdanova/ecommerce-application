import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormInstance, Input, Row, Typography } from 'antd';
import { CustomerSignin } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  errorLayout,
  fieldsProps,
  tailFormItemLayout,
} from '../../components/form/formProps/fieldsProps';
import signInThunk from '../../redux/actions/signInThunk';
import styles from './LoginPage.module.css';

function LoginPage(): JSX.Element {
  const SUCCESS_MESSAGE = 'You have successfully signed in';

  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);
  const [isLoginError, setLoginError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthorized = useAppSelector(
    (state) => state.authorization.isAuthorized,
  );

  useEffect(() => {
    if (isAuthorized) {
      navigate('/');
    }
  }, [isAuthorized]);

  const onReset = () => formRef.current?.resetFields();
  const onFinish = async (values: CustomerSignin) => {
    dispatch(signInThunk(values, setLoginError, SUCCESS_MESSAGE));
  };

  return (
    <div className={styles.loginWrapper}>
      <Form
        {...fieldsProps.loginForm.props}
        form={form}
        ref={formRef}
        onFinish={onFinish}
        onChange={() => setLoginError(false)}
      >
        <h1 style={{ textAlign: 'center' }}>Sign in</h1>

        <Form.Item
          {...fieldsProps.email.props}
          validateStatus={isLoginError ? 'error' : ''}
        >
          <Input placeholder="E-mail" id="login-email" />
        </Form.Item>

        <Form.Item
          {...fieldsProps.password.props}
          validateStatus={isLoginError ? 'error' : ''}
        >
          <Input.Password placeholder="Password" id="login-password" />
        </Form.Item>

        {isLoginError && (
          <Form.Item {...errorLayout}>
            <Typography.Text type="danger">
              Sorry, the provided account doesn&apos;t exist. Please check the
              email or password or consider creating a new account
            </Typography.Text>
          </Form.Item>
        )}

        <Form.Item {...tailFormItemLayout}>
          <Row gutter={16}>
            <Col>
              <Button type="primary" htmlType="submit" id="login-submit-button">
                Sign in
              </Button>
            </Col>
            <Col>
              <Button
                htmlType="button"
                onClick={onReset}
                id="login-reset-button"
              >
                Reset
              </Button>
            </Col>
            <Col style={{ paddingLeft: 0 }}>
              <Button type="link" onClick={() => navigate('/registration')}>
                Create account
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
