import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;
function QrCode({ qrCode, onClose }: { qrCode: string; onClose: () => void }) {
  console.log('qrCode', qrCode);
  return (
    <Container>
      <img src={qrCode} alt="qrCode" />
      <button type="button" onClick={onClose}>
        Close
      </button>
    </Container>
  );
}

export default QrCode;
