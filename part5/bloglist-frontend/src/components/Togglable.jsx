import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'


const Togglable = forwardRef((props, refs) => { {/* con forwardRef el componente puede acceder a la referencia que le fue asignada. */}
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  useImperativeHandle(refs, () => { {/* useImperativeHandle para que la función toggleVisibility esté disponible fuera del componente.. */}
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children} {/* Se utiliza para hacer referencia a los componentes hijos (en este caso, LoginForm y NoteForm) */}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )

})
Togglable.displayName = 'Togglable';
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable
