import styled from '@emotion/native';
import { RGBColor } from 'react-color';

export interface PixelProps {
  color: RGBColor;
}

const Pixel = styled.View<PixelProps>`
  width: 100px;
  height: 100px;
  background-color: ${({ color }) =>
    `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`};
`;

export default Pixel;
