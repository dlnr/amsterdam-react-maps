import { ascDefaultTheme, themeColor } from '@amsterdam/asc-ui'
import { useMapInstance } from '@amsterdam/react-maps'
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import L, { GeoJSONOptions } from 'leaflet'
import proj4 from 'proj4'
import 'proj4leaflet'
import { FunctionComponent, useEffect, useMemo } from 'react'
import { CRS_CONFIG } from '../utils/getCrsRd'

export const defaultStyle = {
  color: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
  fillColor: themeColor('support', 'invalid')({ theme: ascDefaultTheme }),
  weight: 2,
  opacity: 1.6,
  fillOpacity: 0.2,
}

proj4.defs(CRS_CONFIG.RD.code, CRS_CONFIG.RD.projection)

export interface RDFeatureCollectionProps {
  features: Array<Feature>
  properties?: GeoJsonProperties
  options?: GeoJSONOptions
}

type Feature = {
  type: string
  geometry: Geometry
  crs: any
}

const RDFeatureCollection: FunctionComponent<RDFeatureCollectionProps> = ({
  features,
  properties = null,
  options = { style: defaultStyle },
}) => {
  const mapInstance = useMapInstance()

  const collection = useMemo(() => {
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: features.map((feature: Feature) => {
        return {
          type: 'Feature',
          geometry: feature.geometry,
          properties: properties,
          crs: {
            type: 'name',
            properties: {
              name: CRS_CONFIG.RD.code,
            },
          },
        }
      }),
    }

    // return L.Proj.geoJson(featureCollection, options)
    return L.geoJSON(featureCollection, options)
  }, [features, options, properties])

  useEffect(() => {
    collection.addTo(mapInstance)

    return () => {
      collection.removeFrom(mapInstance)
    }
  }, [collection, mapInstance])
  //   }, [geoJSON, mapInstance])

  return null
}

export default RDFeatureCollection
