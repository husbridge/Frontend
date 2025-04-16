import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const bgColors = [
    '#FFD700',
    '#FF4500',
    '#1E90FF',
    '#32CD32',
    '#8A2BE2',
    '#FF1493',
    '#00CED1',
    '#FF6347',
  ];
  

const getBgColor = (name: string) => {
  const nameLength = name.trim().length;
  return bgColors[nameLength % bgColors.length];
};


const getInitials = (name: string) => {
  const nameParts = name.trim().split(' ');

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
};

type AvatarProps = {
  imageUrl?: string;
  alt?: string;
  size?: number;
  link?: string;
  className?: string;
};

const Avatar: FC<AvatarProps> = ({ imageUrl, alt, size = 36, link, className }) => {
  const initials = useMemo(() => (alt ? getInitials(alt) : 'TW'), [alt]);
  const randomBg = useMemo(() => getBgColor(alt || '1'), [alt]);
  const navigate = useNavigate();
  const fontSize = useMemo(() => Math.max(size * 0.4, 12), [size]);


  return (
    <div className={`inline-block ${link && 'cursor-pointer'} ${className}`} onClick={() => {link && navigate(link)}}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="rounded-full object-cover border"
          style={{
            width: size,
            height: size,
            minWidth: size,
          }}
        />
      ) : (
        <div
          className="rounded-full flex items-center justify-center text-white leading-none"
          style={{
            backgroundColor: randomBg,
            height: size,
            width: size,
            fontSize: fontSize,
            paddingTop: size < 35 ? 2 : 0,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
