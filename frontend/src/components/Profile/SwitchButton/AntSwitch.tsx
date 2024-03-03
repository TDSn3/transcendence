import { Switch, ConfigProvider } from 'antd';

interface SwitchProps {
  isToggled: boolean,
  onToggle: () => void,
}

function AntSwitch({ isToggled, onToggle }: SwitchProps) {
  return (
    <div>
      2FA
      &nbsp;&nbsp;
      <ConfigProvider
        theme={{
          components: {
            Switch: {
              colorPrimary: '#000000',
              colorPrimaryHover: '#363533',
              colorTextQuaternary: '#f3f2f1',
              colorTextTertiary: '#E7E7E5', // colorTextQuaternary Hover
            },
          },
        }}
      >
        <Switch className="ant-switch" checked={isToggled} onChange={onToggle} />
      </ConfigProvider>
    </div>
  );
}

export default AntSwitch;
