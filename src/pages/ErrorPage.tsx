import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

function ErrorPage(): JSX.Element {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/');
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={onClick}>
          Back Home
        </Button>
      }
    />
  );
}

export default ErrorPage;
