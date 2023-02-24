import { Watch } from  'react-loader-spinner'

export default function Loading() {
    return (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center position-fixed" style={{background: 'rgba(0,0,0,0.6)', top: 0, left: 0, zIndex: 9999}}>
            <Watch
                height={100} width={100}
                color='black'
                ariaLabel='loading'
            />
        </div>
    )
}