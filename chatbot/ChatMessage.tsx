import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '70%',
  borderRadius: '12px',
  marginBottom: theme.spacing(1.5),
  wordWrap: 'break-word',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.grey[100],
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    [isUser ? 'right' : 'left']: -8,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: isUser ? '0 0 8px 8px' : '0 8px 8px 0',
    borderColor: `transparent transparent ${isUser ? theme.palette.primary.main : theme.palette.grey[100]} transparent`,
  },
}));

const MessageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  textAlign: 'right',
}));

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formattedTime = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  return (
    <MessageContainer>
      <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
        <MessageBubble isUser={isUser}>
          <Typography variant="body1">{message.text}</Typography>
          <TimeStamp>{formattedTime}</TimeStamp>
        </MessageBubble>
      </Box>
    </MessageContainer>
  );
};

export default ChatMessage; 