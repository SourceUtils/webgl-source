/*
 * Valve Counter-Strike BSP related structs
 */

/*
 * Copyright (c) 2012 Felix Wan
 * Email: wanliyou@gmail.com
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

"use strict";

//=============
// BSP Structs and constants
//=============

var MAX_INDEX = 65536;
var MAXLIGHTMAPS = 4;
var HEADER_LUMPS = 19;
var STATIC_PROP_NAME_LENGTH = 128;
var OVERLAY_BSP_FACE_COUNT = 64;

var GAMELUMP_STATIC_PROPS = 1936749168; // 'sprp';

//Name  //Index               //Description
var LUMP_ENTITIES          = 0,	  //   MAP entity text buffer	
  LUMP_PLANES              = 1,	  //   Plane array	
  LUMP_VERTEXES            = 2,	  //   Vertex array	
  LUMP_VISIBILITY          = 3,	  //   Compressed PVS data and directory for all clusters	
  LUMP_NODES               = 4,	  //   Internal node array for the BSP tree	
  LUMP_TEXTURE_INFORMATION = 5,	  //   Face texture application array	
  LUMP_FACES               = 6,	  //   Face array	
  LUMP_LIGHTMAPS           = 7,	  //   Lightmaps	
  LUMP_LEAVES              = 8,	  //   Internal leaf array of the BSP tree	
  LUMP_LEAF_FACE_TABLE     = 9,	  //   Index lookup table for referencing the face array from a leaf	
  LUMP_LEAF_BRUSH_TABLE    = 10 , //     ?	
  LUMP_EDGES               = 11 , //     Edge array	
  LUMP_FACE_EDGE_TABLE     = 12 , //     Index lookup table for referencing the edge array from a face	
  LUMP_MODELS              = 13 , //     ?	
  LUMP_BRUSHES             = 14 , //     ?	
  LUMP_BRUSH_SIDES         = 15 , //     ?	
  LUMP_POP                 = 16 , //     ?	
  LUMP_AREAS               = 17 , //     ?       	
  LUMP_AREA_PORTALS        = 18 ; //     ?


// TexInfo Flags
var SURF_LIGHT = 0x0001, // value will hold the light strength
    SURF_SKY2D = 0x0002, // don't draw, indicates we should skylight + draw 2d sky but not draw the 3D skybox
    SURF_SKY = 0x0004, // don't draw, but add to skybox
    SURF_WARP = 0x0008, // turbulent water warp
    SURF_TRANS = 0x0010,
    SURF_NOPORTAL = 0x0020, // the surface can not have a portal placed on it
    SURF_TRIGGER = 0x0040, // FIXME: This is an xbox hack to work around elimination of trigger surfaces, which breaks occluders
    SURF_NODRAW = 0x0080, // don't bother referencing the texture
    SURF_HINT = 0x0100, // make a primary bsp splitter
    SURF_SKIP = 0x0200, // completely ignore, allowing non-closed brushes
    SURF_NOLIGHT = 0x0400, // Don't calculate light
    SURF_BUMPLIGHT = 0x0800, // calculate three lightmaps for the surface for bumpmapping
    SURF_NOSHADOWS = 0x1000, // Don't receive shadows
    SURF_NODECALS = 0x2000, // Don't receive decals
    SURF_NOCHOP = 0x4000, // Don't subdivide patches on this surface 
    SURF_HITBOX = 0x8000; // surface is part of a hitbox

var Vector = Struct.create(
    Struct.float32("x"),
    Struct.float32("y"),
    Struct.float32("z")
);

var QAngle = Struct.create(
    Struct.float32("x"),
    Struct.float32("y"),
    Struct.float32("z")
);

var ColorRGBExp32 = Struct.create(
    Struct.uint8("r"), Struct.uint8("g"), Struct.uint8("b"),
    Struct.int8("exponent")
);

var CompressedLightCube = Struct.create(
    Struct.array("m_Color", ColorRGBExp32, 6)
);

/*
struct bsp_lump
{
  uint32    offset;     // offset (in bytes) of the data from the beginning of the file
  uint32    length;     // length (in bytes) of the data
};

struct bsp_header
{
  uint32    magic;      // magic number ("IBSP")
  uint32    version;    // version of the BSP format (38)

  bsp_lump  lump[19];   // directory of the lumps
};
*/

var lump_t = Struct.create(
    Struct.uint32("fileofs"),
    Struct.uint32("filelen")
);

var dheader_t = Struct.create(
    Struct.string("ident", 4),
    Struct.uint32("version"),
    Struct.array("lumps", lump_t, HEADER_LUMPS)
);

var dplane_t = Struct.create(
    Struct.struct("normal", Vector),
    Struct.float32("dist"),
    Struct.int32("type")
);

var dedge_t = Struct.create(
    Struct.array("v", Struct.uint16(), 2)
);


/*
struct bsp_face
{
    uint16   plane;             // index of the plane the face is parallel to
    uint16   plane_side;        // set if the normal is parallel to the plane normal
    uint32   first_edge;        // index of the first edge (in the face edge array)
    uint16   num_edges;         // number of consecutive edges (in the face edge array)
    uint16   texture_info;      // index of the texture info structure	
    uint8    lightmap_syles[4]; // styles (bit flags) for the lightmaps
    uint32   lightmap_offset;   // offset of the lightmap (in bytes) in the lightmap lump
};
*/

var dface_t = Struct.create(
    Struct.uint16("planenum"),
    Struct.uint16("side"),
    Struct.uint32("firstedge"),
    Struct.uint16("numedges"),   
    Struct.uint16("texinfo"),
    Struct.array("styles", Struct.uint8(), MAXLIGHTMAPS),
    Struct.uint32("lightofs")
);

var texinfo_vec = Struct.create(
    Struct.float32("x"),
    Struct.float32("y"),
    Struct.float32("z"),
    Struct.float32("offset")
);

/*
struct bsp_texinfo
{
    point3f  u_axis;
    float    u_offset;
    point3f  v_axis;
    float    v_offset;
    uint32   flags;
    uint32   value;
    char     texture_name[32];
    uint32   next_texinfo;
};
*/
var texinfo_t = Struct.create(
    Struct.array("textureVecsTexelsPerWorldUnits", texinfo_vec, 2),
    //Struct.array("lightmapVecsLuxelsPerWorldUnits", texinfo_vec, 2),
    Struct.uint32("flags"), 
    Struct.uint32("texdata"),
    Struct.string("texname", 32),
    Struct.uint32("nexttexinfo")
);

var dtexdata_t = Struct.create(
    Struct.struct("reflectivity", Vector),
    Struct.int32("nameStringTableID"),
    Struct.int32("width"),
    Struct.int32("height"),
    Struct.int32("view_width"), 
    Struct.int32("view_height"),
    {
        faces: {
            value: null
        },
        
        addFace: {
            value: function(face) {
                if(!this.faces) {
                    this.faces = [];
                }
                this.faces.push(face);
            }
        },
        
        numvertex: {
            value: 0
        }
    }
);

var dmodel_t = Struct.create(
    Struct.struct("mins", Vector), Struct.struct("maxs", Vector),
    Struct.struct("origin", Vector),
    Struct.int32("headnode"),
    Struct.int32("firstface"),
    Struct.int32("numfaces")
);

/*
struct bsp_node
{
    uint32   plane;             // index of the splitting plane (in the plane array)
    int32    front_child;       // index of the front child node or leaf
    int32    back_child;        // index of the back child node or leaf
    point3s  bbox_min;          // minimum x, y and z of the bounding box
    point3s  bbox_max;          // maximum x, y and z of the bounding box
    uint16   first_face;        // index of the first face (in the face array)
    uint16   num_faces;         // number of consecutive edges (in the face array)
};
*/

var dnode_t = Struct.create(
    Struct.int32("planenum"),
    Struct.array("children", Struct.int32(), 2),
    Struct.array("mins", Struct.int16(), 3),
    Struct.array("maxs", Struct.int16(), 3),
    Struct.uint16("firstface"),
    Struct.uint16("numfaces")
);

/*
struct bsp_leaf
{
    uint32   brush_or;          // ?
    uint16   cluster;           // -1 for cluster indicates no visibility information
    uint16   area;              // ?
    point3s  bbox_min;          // bounding box minimums
    point3s  bbox_max;          // bounding box maximums
    uint16   first_leaf_face;   // index of the first face (in the face leaf array)
    uint16   num_leaf_faces;    // number of consecutive edges (in the face leaf array)
    uint16   first_leaf_brush;  // ?
    uint16   num_leaf_brushes;  // ?
};
*/

var dleaf_t = Struct.create(
    Struct.uint32("contents"),
    Struct.uint16("cluster"),
    Struct.uint16("area"), // Packing issues here, should be 9 bits
    //Struct.int8("flags"), // packing issues here, should be 7 bits
    Struct.array("mins", Struct.int16(), 3),
    Struct.array("maxs", Struct.int16(), 3),
    Struct.uint16("firstleafface"),
    Struct.uint16("numleaffaces"),
    Struct.uint16("firstleafbrush"),
    Struct.uint16("numleafbrushes"),
    Struct.skip(2), // Pad to 4 byte boundries
    {
        props: {
            value: null
        },
        
        addProp: {
            value: function(prop) {
                if(!this.props) {
                    this.props = [];
                }
                this.props.push(prop);
            }
        },
        
        triStrips: {
            value: null
        },
        
        addTriStrip: {
            value: function(triStrip) {
                if(!this.triStrips) {
                    this.triStrips = [];
                }
                this.triStrips.push(triStrip);
            }
        }
    }
);

var dvisheader_t = Struct.create(
    Struct.int32("numclusters")
);

var dvis_t = Struct.create(
    Struct.int32("visofs"),
    Struct.int32("audofs")
);

var dbrush_t = Struct.create(
    Struct.int32("firstside"),
    Struct.int32("numsides"),
    Struct.int32("contents")
);

var dbrushside_t = Struct.create(
    Struct.uint16("planenum"),
    Struct.int16("texinfo"),
    Struct.int16("dispinfo"),
    Struct.int16("bevel")
);

var dgamelumpheader_t = Struct.create(
    Struct.int32("lumpCount")
);

var dgamelump_t = Struct.create(
    Struct.int32("id"),
    Struct.uint16("flags"),
    Struct.uint16("version"),
    Struct.int32("fileofs"),
    Struct.int32("filelen")
);

var StaticPropDictLumpHeader_t = Struct.create(
    Struct.int32("dictEntries")
);

var StaticPropDictLump_t = Struct.create(
    Struct.string("m_Name", STATIC_PROP_NAME_LENGTH),
    {
        props: {
            value: null
        },
        
        addProp: {
            value: function(prop) {
                if(!this.props) {
                    this.props = [];
                }
                this.props.push(prop);
            }
        }
    }
);

var StaticPropLeafLumpHeader_t = Struct.create(
    Struct.int32("leafEntries")
);

var StaticPropLeafLump_t = Struct.create(
    Struct.uint16("m_Leaf")
);

var StaticPropLumpHeader_t = Struct.create(
    Struct.int32("propEntries")
);

var StaticPropLump_t = Struct.create(
    Struct.struct("m_Origin", Vector),
    Struct.struct("m_Angles", QAngle),
    Struct.uint16("m_PropType"),
    Struct.uint16("m_FirstLeaf"),
    Struct.uint16("m_LeafCount"),
    Struct.uint8("m_Solid"),
    Struct.uint8("m_Flags"),
    Struct.int32("m_Skin"),
    Struct.float32("m_FadeMinDist"),
    Struct.float32("m_FadeMaxDist"),
    Struct.struct("m_LightingOrigin", Vector),
    Struct.float32("m_flForcedFadeScale"),
    Struct.uint16("m_nMinDXLevel"),
    Struct.uint16("m_nMaxDXLevel")
);

var dCubemapSample_t = Struct.create(
    Struct.array("origin", Struct.int32(), 3),
    Struct.int32("size")
);

var doverlay_t = Struct.create(
    Struct.int32("id"),
    Struct.int16("texInfo"),
    Struct.uint16("faceCountAndRenderOrder"),
    Struct.array("Ofaces", Struct.int32(), OVERLAY_BSP_FACE_COUNT),
    Struct.array("U", Struct.float32(), 2),
    Struct.array("V", Struct.float32(), 2),
    Struct.array("UVPoints", Vector, 4),
    Struct.struct("Origin", Vector),
    Struct.struct("BasisNormal", Vector)
);
