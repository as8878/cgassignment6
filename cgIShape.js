class cgIShape {
    constructor () {
        this.points = [];
        this.bary = [];
        this.indices = [];
    }
    
    addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        var nverts = this.points.length / 4;
        
        // push first vertex
        this.points.push(x0);  this.bary.push (1.0);
        this.points.push(y0);  this.bary.push (0.0);
        this.points.push(z0);  this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
        
        // push second vertex
        this.points.push(x1); this.bary.push (0.0);
        this.points.push(y1); this.bary.push (1.0);
        this.points.push(z1); this.bary.push (0.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++
        
        // push third vertex
        this.points.push(x2); this.bary.push (0.0);
        this.points.push(y2); this.bary.push (0.0);
        this.points.push(z2); this.bary.push (1.0);
        this.points.push(1.0);
        this.indices.push(nverts);
        nverts++;
    }
}

class Cube extends cgIShape {
    constructor(subdivisions) {
        super();
        this.makeCube(subdivisions);
    }

    makeCube(subdivisions) {
        const xDivisions = subdivisions;
        const yDivisions = subdivisions;
        const xStep = 1.0 / xDivisions;
        const yStep = 1.0 / yDivisions;
        const start = -0.5;

        // FRONT & BACK
        for (let i = 0; i < xDivisions; i++) {
            for (let j = 0; j < yDivisions; j++) {
                const u0 = start + i * xStep;
                const u1 = u0 + xStep;
                const v0 = start + j * yStep;
                const v1 = v0 + yStep;

                // FRONT face (+z)
                this.addTriangle(u0, v0, 0.5, u1, v0, 0.5, u1, v1, 0.5);
                this.addTriangle(u0, v0, 0.5, u1, v1, 0.5, u0, v1, 0.5);

                // BACK face (-z)
                this.addTriangle(u0, v0, -0.5, u1, v1, -0.5, u1, v0, -0.5);
                this.addTriangle(u0, v0, -0.5, u0, v1, -0.5, u1, v1, -0.5);
            }
        }

        // LEFT & RIGHT
        for (let i = 0; i < yDivisions; i++) {
            for (let j = 0; j < xDivisions; j++) {
                const u0 = start + i * yStep;
                const u1 = u0 + yStep;
                const v0 = start + j * xStep;
                const v1 = v0 + xStep;

                // RIGHT face (+x)
                this.addTriangle(0.5, u0, v0, 0.5, u1, v0, 0.5, u1, v1);
                this.addTriangle(0.5, u0, v0, 0.5, u1, v1, 0.5, u0, v1);

                // LEFT face (-x)
                this.addTriangle(-0.5, u0, v0, -0.5, u1, v1, -0.5, u1, v0);
                this.addTriangle(-0.5, u0, v0, -0.5, u0, v1, -0.5, u1, v1);
            }
        }

        // TOP & BOTTOM
        for (let i = 0; i < xDivisions; i++) {
            for (let j = 0; j < yDivisions; j++) {
                const u0 = start + i * xStep;
                const u1 = u0 + xStep;
                const v0 = start + j * yStep;
                const v1 = v0 + yStep;

                // TOP face (+y)
                this.addTriangle(u0, 0.5, v0, u1, 0.5, v1, u1, 0.5, v0);
                this.addTriangle(u0, 0.5, v0, u0, 0.5, v1, u1, 0.5, v1);

                // BOTTOM face (-y)
                this.addTriangle(u0, -0.5, v0, u1, -0.5, v0, u1, -0.5, v1);
                this.addTriangle(u0, -0.5, v0, u1, -0.5, v1, u0, -0.5, v1);
            }
        }
    }
}

class Cylinder extends cgIShape {
    constructor(radialdivision, heightdivision) {
        super();
        this.makeCylinder(radialdivision, heightdivision);
    }

    makeCylinder(radialdivision, heightdivision) {
        let angleStep = (2 * Math.PI) / radialdivision;
        let heightStep = 1.0 / heightdivision;

        for (let i = 0; i < radialdivision; i++) {
            let theta1 = angleStep * i;
            let theta2 = angleStep * (i + 1);

            let x1 = 0.5 * Math.cos(theta1);
            let y1 = 0.5 * Math.sin(theta1);
            let x2 = 0.5 * Math.cos(theta2);
            let y2 = 0.5 * Math.sin(theta2);

            // Top cap
            this.addTriangle(0, 0, 0.5, x1, y1, 0.5, x2, y2, 0.5);
            // Bottom cap
            this.addTriangle(0, 0, -0.5, x2, y2, -0.5, x1, y1, -0.5);

            for (let j = 0; j < heightdivision; j++) {
                let z1 = -0.5 + j * heightStep;
                let z2 = -0.5 + (j + 1) * heightStep;

                this.addTriangle(x1, y1, z1, x2, y2, z1, x2, y2, z2);
                this.addTriangle(x1, y1, z1, x2, y2, z2, x1, y1, z2);
            }
        }
    }
}
class Cone extends cgIShape {
    constructor(radialdivision, heightdivision) {
        super();
        this.makeCone(radialdivision, heightdivision);
    }

    makeCone(radialdivision, heightdivision) {
        radialdivision = Math.max(3, radialdivision);
        heightdivision = Math.max(1, heightdivision);

        let angleStep = (2 * Math.PI) / radialdivision;
        let heightStep = 1.0 / heightdivision;

        for (let i = 0; i < radialdivision; i++) {
            let theta1 = angleStep * i;
            let theta2 = angleStep * ((i + 1) % radialdivision); 

            let x1 = 0.5 * Math.cos(theta1);
            let y1 = 0.5 * Math.sin(theta1);
            let x2 = 0.5 * Math.cos(theta2);
            let y2 = 0.5 * Math.sin(theta2);

            // Bottom cap
            this.addTriangle(0, 0, -0.5, x2, y2, -0.5, x1, y1, -0.5);

            for (let j = 0; j < heightdivision; j++) {
                let z = -0.5 + j * heightStep;
                let zNext = -0.5 + (j + 1) * heightStep;

                let r = 0.5 * (1 - j / heightdivision);
                let rNext = 0.5 * (1 - (j + 1) / heightdivision);

                let x1c = r * Math.cos(theta1);
                let y1c = r * Math.sin(theta1);
                let x2c = r * Math.cos(theta2);
                let y2c = r * Math.sin(theta2);

                let x1n = rNext * Math.cos(theta1);
                let y1n = rNext * Math.sin(theta1);
                let x2n = rNext * Math.cos(theta2);
                let y2n = rNext * Math.sin(theta2);

                if (j === heightdivision - 1) {
                    this.addTriangle(x1c, y1c, z, x2c, y2c, z, 0, 0, 0.5);
                } else {
                    this.addTriangle(x1c, y1c, z, x2c, y2c, z, x2n, y2n, zNext);
                    this.addTriangle(x1c, y1c, z, x2n, y2n, zNext, x1n, y1n, zNext);
                }
            }
        }
    }
}
class Sphere extends cgIShape {
    constructor(slices, stacks) {
        super();
        this.makeSphere(slices, stacks);
    }

    makeSphere(slices, stacks) {
        slices = Math.max(3, slices || 3);
        stacks = Math.max(2, stacks || 2);

        const radius = 0.5;
        const dTheta = (2 * Math.PI) / slices;
        const dPhi = Math.PI / stacks;

        for (let i = 0; i < slices; i++) {
            const theta1 = i * dTheta;
            const theta2 = (i + 1) * dTheta;

            for (let j = 0; j < stacks; j++) {
                const phi1 = j * dPhi;
                const phi2 = (j + 1) * dPhi;

                const p1 = this.getSpherePoint(radius, theta1, phi1); 
                const p2 = this.getSpherePoint(radius, theta1, phi2); 
                const p3 = this.getSpherePoint(radius, theta2, phi1); 
                const p4 = this.getSpherePoint(radius, theta2, phi2); 

                this.addTriangle(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z);
                this.addTriangle(p1.x, p1.y, p1.z, p4.x, p4.y, p4.z, p2.x, p2.y, p2.z);
            }
        }
    }

    getSpherePoint(r, theta, phi) {
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi)
        };
    }
}



function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

