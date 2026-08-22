function Button({ text, type = 'button', onClick }) {
  return (
    <button type={type} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
