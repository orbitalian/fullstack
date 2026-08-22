import Button from './components/Button';
import Input from './components/Input';

function App() {
  const handleClick = () => {
    console.log('Кнопку натиснуто!');
  };

  const handleChange = (e) => {
    console.log('Значення:', e.target.value);
  };

  return (
    <div>
      <h1>React Components</h1>

      <Button
        text="Натисни мене"
        type="button"
        onClick={handleClick}
      />

      <Input
        placeholder="Введіть текст..."
        type="text"
        onChange={handleChange}
      />

      <Input
        placeholder="Введіть пароль..."
        type="password"
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
