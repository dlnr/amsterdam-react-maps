import { ascDefaultTheme, themeColor } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import { render } from '@testing-library/react'
import L from 'leaflet'
import { mocked } from 'ts-jest/utils'
import DrawTool from './DrawTool'
import { PolygonType } from './types'

jest.mock('@amsterdam/react-maps')

const mockedUseMapInstance = mocked(useMapInstance)

describe('DrawTool', () => {
  let onMock: jest.Mock
  let offMock: jest.Mock
  let addLayerMock: jest.Mock
  let removeLayerMock: jest.Mock
  let hasLayerMock: jest.Mock
  beforeEach(() => {
    onMock = jest.fn()
    offMock = jest.fn()
    addLayerMock = jest.fn()
    removeLayerMock = jest.fn()
    hasLayerMock = jest.fn(() => true)
    // @ts-ignore
    mockedUseMapInstance.mockImplementation(() => ({
      addLayer: addLayerMock,
      removeLayer: removeLayerMock,
      on: onMock,
      off: offMock,
      hasLayer: hasLayerMock,
    }))
  })

  const initialDrawnItems = [
    L.polygon(
      [
        [52.37000756868467, 4.894187572618143],
        [52.36638286187091, 4.893981190127323],
        [52.369541390869465, 4.89828766015057],
      ],
      {
        color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      },
    ),
    L.polygon(
      [
        [52.37594820185194, 4.892147803888032],
        [52.37206742179071, 4.888490687556837],
        [52.373527030104974, 4.89814504712679],
      ],
      {
        color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
        bubblingMouseEvents: false,
      },
    ),
  ] as Array<PolygonType>

  describe('Drawtool', () => {
    it('should call onInitLayers and onDrawEnd when passing initial drawing', () => {
      hasLayerMock = jest.fn(() => false)
      const onInitLayersMock = jest.fn()
      const onDrawEndMock = jest.fn()
      render(
        <DrawTool
          onDrawEnd={onDrawEndMock}
          onInitLayers={onInitLayersMock}
          drawnItems={initialDrawnItems}
        />,
      )
      expect(onInitLayersMock).toHaveBeenNthCalledWith(1, initialDrawnItems)
      expect(onDrawEndMock).toHaveBeenCalledTimes(2) // 2 initial drawings
    })
  })
})
