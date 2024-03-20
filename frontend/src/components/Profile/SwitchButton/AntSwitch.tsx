import { Switch, ConfigProvider } from 'antd';

interface SwitchProps {
  isToggled: boolean,
  onToggle: () => void,
  handleQrCode: () => Promise<void>,
}

function AntSwitch({ isToggled, onToggle, handleQrCode }: SwitchProps) {
  return (
    <div>
      2FA &nbsp;&nbsp;
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
        <Switch
          className="ant-switch"
          checked={isToggled}
          onChange={() => {
            onToggle();
            handleQrCode();
            console.log('isToggled', isToggled);
          }}
        />
      </ConfigProvider>
    </div>
  );
}

export default AntSwitch;
