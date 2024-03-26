import styled from 'styled-components';

export const Canvas = styled.canvas`
  display: flex;
  width: 100%;
  height: fit-content;
  max-height: 650px;
  max-width: 1700px;
  @media screen and (max-width: 500px) {
    height: 200px;
  }
`;
